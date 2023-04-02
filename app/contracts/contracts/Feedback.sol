//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ZKProofOfHumanity.sol";

contract Feedback {
    event NewFeedback(bytes32 feedback);
    event NewGreeting(bytes32 greeting);

    ZKProofOfHumanity public zKProofOfHumanity;
    uint256 public externalNullifier;

    constructor(address zkPoHAddress) {
        zKProofOfHumanity = ZKProofOfHumanity(zkPoHAddress);
        bytes32 hash = keccak256(abi.encodePacked(address(this)));
        externalNullifier = uint256(hash);
    }

    function sendFeedback(
        bytes32 feedback,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public {
        zKProofOfHumanity.verifyProof(merkleTreeRoot, uint256(feedback), nullifierHash, externalNullifier, proof);

        emit NewFeedback(feedback);
    }

    function greet(bytes32 greeting, uint256 merkleTreeRoot, uint256 nullifierHash, uint256[8] calldata proof) public {
        zKProofOfHumanity.verifyHumanity(merkleTreeRoot, uint256(greeting), nullifierHash, 42, proof);

        emit NewGreeting(greeting);
    }
}
