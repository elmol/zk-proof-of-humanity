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
    uint256 public constant TREE_DEPTH = 20; // 2^20 humans
    ISemaphore public semaphore;
    IProofOfHumanity poh;
    uint256 public groupId;
    //identityCommitment -> humans
    mapping(uint256 => bool) private identities;

    //humans -> is human registered
    EnumerableSet.AddressSet private humans;

    //humans -> identityCommitment
    mapping(address => uint256) private identitiesMap;

    constructor(address semaphoreAddress, address pohAddress, uint256 _groupId) {
        semaphore = ISemaphore(semaphoreAddress);
        poh = IProofOfHumanity(pohAddress);
        groupId = _groupId;
        semaphore.createGroup(groupId, TREE_DEPTH, address(this));
    }

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
    ) public {
        semaphore.verifyProof(groupId, merkleTreeRoot, signal, nullifierHash, externalNullifier, proof);
        emit HumanProofVerified(signal);
    }

    /**
     * @dev Verifies humanity and emits an event if the zero-knowledge proof is valid.
     * @param merkleTreeRoot Root of the Merkle tree.
     * @param nullifierHash Nullifier hash.
     * @param proof Zero-knowledge proof.
     * @dev  Note that a double-signaling check is not included here, and should be carried by the caller.
     * @dev  Also, verification of proofs created with old Merkle tree roots (expiraton time) is not included here.
     */
    function verifyHumanity(
        uint256 merkleTreeRoot,
        uint256 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) public {
        Semaphore semaphoreImpl = Semaphore(address(semaphore));
        uint256 currentMerkleTreeRoot = semaphoreImpl.getMerkleTreeRoot(groupId);

        if (merkleTreeRoot != currentMerkleTreeRoot) {
            revert ZKPoH__InvalidProofOfHumanity();
        }

        ISemaphoreVerifier verifier = semaphoreImpl.verifier();
        verifier.verifyProof(merkleTreeRoot, nullifierHash, signal, externalNullifier, proof, TREE_DEPTH);
        emit HumanProofVerified(signal);
    }

    function matchAccount(address account, uint256[] calldata proofSiblings, uint8[] calldata proofPathIndices) public {
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
    function mismatchedAccounts() public view returns (address[] memory) {
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
    function shrinkArray(address[] memory array, uint newLength) internal pure returns (address[] memory) {
        /// @solidity memory-safe-assembly
        assembly {
            mstore(array, newLength)
        }
        return array;
    }
}
