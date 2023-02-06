//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@semaphore-protocol/contracts/Semaphore.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./IProofOfHumanity.sol";

/**
 * @title ZKProofOfHumanity
 * @notice ZKProofOfHumanity integrates ProofOfHumanity V1 with Semaphore to prove humanity without doxing.
 * @dev The ZKProofOfHumanity contract has a Semaphore group where PoH accounts may be added as members.
 * @dev Semaphore verification proof is used to avoid double-signaling, also humanity could be verified without signal.
 */
contract ZKProofOfHumanity {
    // Add the library methods
    using EnumerableMap for EnumerableMap.UintToAddressMap;
    using EnumerableSet for EnumerableSet.AddressSet;

    /* Custom Errors */
    error ZKPoH__AccountAlreadyExists();
    error ZKPoH__InvalidProofOfHumanity();
    error ZKPoH__AccountNotRegisteredInPoH();

    /* Events */
    event HumanProofVerified(uint256 signal);
    event NewUser(uint256 identityCommitment, address account);

    /* Storage */
    uint256 public constant TREE_DEPTH = 20; // 2^20 humans
    ISemaphore public semaphore;
    IProofOfHumanity poh;
    uint256 public groupId;
    //identityCommitment -> humans
    EnumerableMap.UintToAddressMap private identitiesMap;

    //humans -> is human registered
    mapping(address => bool) private humans;
    EnumerableSet.AddressSet private humansSet;

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
        if (humans[msg.sender]) {
            revert ZKPoH__AccountAlreadyExists();
        }

        // checks if the entity is already registered

        (bool isNotRegistered, ) = identitiesMap.tryGet(identityCommitment);
        if (isNotRegistered) {
            revert ZKPoH__AccountAlreadyExists();
        }

        semaphore.addMember(groupId, identityCommitment);

        identitiesMap.set(identityCommitment, msg.sender);
        humansSet.add(msg.sender);
        humans[msg.sender] = true;

        emit NewUser(identityCommitment, msg.sender);
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
     */
    function verifyHumanity(uint256 merkleTreeRoot, uint256 nullifierHash, uint256[8] calldata proof) public {
        Semaphore semaphoreImpl = Semaphore(address(semaphore));
        uint256 currentMerkleTreeRoot = semaphoreImpl.getMerkleTreeRoot(groupId);

        if (merkleTreeRoot != currentMerkleTreeRoot) {
            revert ZKPoH__InvalidProofOfHumanity();
        }

        ISemaphoreVerifier verifier = semaphoreImpl.verifier();
        uint256 signal = groupId;
        uint256 externalNullifier = groupId;
        verifier.verifyProof(merkleTreeRoot, nullifierHash, signal, externalNullifier, proof, TREE_DEPTH);
        emit HumanProofVerified(signal);
    }

    function accountsToRemove() public view returns (address[] memory) {
        uint256 length = humansSet.length();
        address[] memory toRemove = new address[](length);
        uint256 lengthToRemove;
        for (uint256 i = 0; i < length; i++) {
            address account = humansSet.at(i);
            if (!poh.isRegistered(account)) {
                toRemove[i] = account;
                lengthToRemove++;
            }
        }

        return shrinkArray(toRemove, lengthToRemove);
    }

    function shrinkArray(address[] memory array, uint newLength) internal pure returns (address[] memory) {
        require(newLength <= array.length, "Array: length after shrinking larger than before");
        /// @solidity memory-safe-assembly
        assembly {
            mstore(array, newLength)
        }
        return array;
    }
}
