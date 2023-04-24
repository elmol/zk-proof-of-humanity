//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@semaphore-protocol/contracts/Semaphore.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

import "./IProofOfHumanity.sol";

/**
 * @title ZKProofOfHumanity
 * @notice ZKProofOfHumanity integrates ProofOfHumanity V1 with Semaphore to prove humanity without doxing.
 * @dev The ZKProofOfHumanity contract has a Semaphore group where PoH accounts may be added as members.
 * @dev Semaphore verification proof is used to avoid double-signaling, also humanity could be verified without signal.
 */
contract ZKProofOfHumanity {
    // Add the library methods
    using EnumerableSet for EnumerableSet.AddressSet;

    /* Custom Errors */
    error ZKPoH__AccountAlreadyExists();
    error ZKPoH__InvalidProofOfHumanity();
    error ZKPoH__AccountNotRegisteredInPoH();
    error ZKPoH__NotRegisteredAccount();
    error ZKPoH__AccountAlreadyMatch();

    /* Events */
    event HumanProofVerified(uint256 signal);
    event HumanRegistered(uint256 identityCommitment, address account);
    event HumanRemoved(uint256 identityCommitment, address account);

    /* Storage */
    ISemaphore public semaphore;
    IProofOfHumanity public poh;
    uint256 public groupId;
    uint256 public depth;
    //identityCommitment -> humans
    mapping(uint256 => bool) private identities;

    //humans -> is human registered
    EnumerableSet.AddressSet private humans;

    //humans -> identityCommitment
    mapping(address => uint256) private identitiesMap;

    constructor(address semaphoreAddress, address pohAddress, uint256 _groupId, uint256 _depth) {
        semaphore = ISemaphore(semaphoreAddress);
        poh = IProofOfHumanity(pohAddress);
        groupId = _groupId;
        depth = _depth;
        semaphore.createGroup(groupId, _depth, address(this));
    }

    /**
     * @dev Registers a human account and emits an event
     * @param identityCommitment identity commitment
     */
    function register(uint256 identityCommitment) external {
        //checks if  the msg sender is not registered in PoH
        if (!poh.isRegistered(msg.sender)) {
            revert ZKPoH__AccountNotRegisteredInPoH();
        }

        // checks if the msg sender is already registered
        if (isRegistered(msg.sender)) {
            revert ZKPoH__AccountAlreadyExists();
        }

        // checks if the entity is already registered

        if (identities[identityCommitment]) {
            revert ZKPoH__AccountAlreadyExists();
        }

        semaphore.addMember(groupId, identityCommitment);
        identities[identityCommitment] = true;
        humans.add(msg.sender);
        identitiesMap[msg.sender] = identityCommitment;

        emit HumanRegistered(identityCommitment, msg.sender);
    }

    function isRegistered(address account) public view returns (bool) {
        return humans.contains(account);
    }

    function isIdentity(address account) public view returns (bool) {
        return identitiesMap[account] != 0;
    }

    /**
     * @dev Saves the nullifier hash to avoid double signaling and emits an event
     * if the zero-knowledge proof is valid.
     * @param merkleTreeRoot Root of the Merkle tree.
     * @param signal Semaphore signal.
     * @param nullifierHash Nullifier hash.
     * @param externalNullifier External nullifier.
     * @param proof Zero-knowledge proof.
     */
    function verifyProof(
        uint256 merkleTreeRoot,
        uint256 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external {
        semaphore.verifyProof(groupId, merkleTreeRoot, signal, nullifierHash, externalNullifier, proof);
        emit HumanProofVerified(signal);
    }

    /**
     * @dev Verifies humanity if the zero-knowledge proof is valid.
     * @param merkleTreeRoot Root of the Merkle tree.
     * @param nullifierHash Nullifier hash.
     * @param proof Zero-knowledge proof.
     * @return currentMerkleTreeRoot
     * @dev  Note that a double-signaling check is not included here, and should be carried by the caller.
     * @dev  Also, verification of proofs created with old Merkle tree roots (expiraton time) is not included here.
     */
    function verifyHumanity(
        uint256 merkleTreeRoot,
        uint256 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external view returns (uint256) {
        Semaphore semaphoreImpl = Semaphore(address(semaphore));
        uint256 currentMerkleTreeRoot = semaphoreImpl.getMerkleTreeRoot(groupId);

        if (merkleTreeRoot != currentMerkleTreeRoot) {
            revert ZKPoH__InvalidProofOfHumanity();
        }

        ISemaphoreVerifier verifier = semaphoreImpl.verifier();
        verifier.verifyProof(merkleTreeRoot, nullifierHash, signal, externalNullifier, proof, depth);
        return currentMerkleTreeRoot;
    }

    /**
     * @dev Removes human account from zkPoH if is no longer valid in PoH
     * @param account Human account to remove
     * @param proofSiblings: Array of the sibling nodes of the proof of membership.
     * @param proofPathIndices: Path of the proof of membership.
     */
    function matchAccount(
        address account,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external {
        if (!this.isRegistered(account)) {
            revert ZKPoH__NotRegisteredAccount();
        }

        if (poh.isRegistered(account)) {
            revert ZKPoH__AccountAlreadyMatch();
        }

        uint256 identity = identitiesMap[account];
        humans.remove(account);
        semaphore.removeMember(groupId, identity, proofSiblings, proofPathIndices);
        identities[identitiesMap[account]] = false;
        delete identitiesMap[account];

        emit HumanRemoved(identity, account);
    }

    /**
     * @dev Returns the mismachedAccounts between zkPoH and PoH
     * @return mismachedAccount mismached accounts between zkPoH and PoH
     */
    function mismatchedAccounts() external view returns (address[] memory) {
        uint256 length = humans.length();
        address[] memory toRemove = new address[](length);
        uint256 lengthToRemove;
        for (uint256 i = 0; i < length; i++) {
            address account = humans.at(i);
            if (!poh.isRegistered(account)) {
                toRemove[i] = account;
                lengthToRemove++;
            }
        }

        return shrinkArray(toRemove, lengthToRemove);
    }

    /**
     * @dev shrink and array, newLenght should be less or equal than the array length
     */
    function shrinkArray(address[] memory array, uint256 newLength) internal pure returns (address[] memory) {
        /// @solidity memory-safe-assembly
        assembly {
            mstore(array, newLength)
        }
        return array;
    }
}
