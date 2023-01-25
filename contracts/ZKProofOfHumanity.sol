//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract ZKProofOfHumanity {
    error ZKPoH__AccountAlreadyExists();

    event NewFeedback(bytes32 feedback);
    event NewUser(uint256 identityCommitment, address account);

    ISemaphore public semaphore;

    uint256 public groupId;
    mapping(uint256 => address) public humans;

    constructor(address semaphoreAddress, uint256 _groupId) {
        semaphore = ISemaphore(semaphoreAddress);
        groupId = _groupId;

        semaphore.createGroup(groupId, 20, address(this));
    }

    function register(uint256 identityCommitment, address account) external {
        if (humans[identityCommitment] != address(0)) {
            revert ZKPoH__AccountAlreadyExists();
        }

        semaphore.addMember(groupId, identityCommitment);

        humans[identityCommitment] = account;

        emit NewUser(identityCommitment, account);
    }

    function sendFeedback(
        bytes32 feedback,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        semaphore.verifyProof(groupId, merkleTreeRoot, uint256(feedback), nullifierHash, groupId, proof);

        emit NewFeedback(feedback);
    }
}
