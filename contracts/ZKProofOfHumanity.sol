//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract ZKProofOfHumanity {
    error ZKPoH__AccountAlreadyExists();

    event HumanProofVerified(uint256 signal);
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

    function verifyProof(
        uint256 merkleTreeRoot,
        uint256 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) public {
        semaphore.verifyProof(
            groupId,
            merkleTreeRoot,
            signal,
            nullifierHash,
            externalNullifier,
            proof
        );
        emit HumanProofVerified(signal);
    }
}
