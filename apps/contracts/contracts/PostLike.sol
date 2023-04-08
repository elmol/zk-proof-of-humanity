//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ZKProofOfHumanity.sol";

contract PostLike {
    ZKProofOfHumanity public zKProofOfHumanity;
    string public message = "The house is in order";
    uint256 public messageId;

    constructor(address zkPoHAddress, uint256 _messageId) {
        zKProofOfHumanity = ZKProofOfHumanity(zkPoHAddress);
        messageId = _messageId;
    }
}
