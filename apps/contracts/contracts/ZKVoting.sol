//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ZKProofOfHumanity.sol";

contract ZKVoting {
 
    string public message = "Voting system for president";
    uint256 public messageId;

    constructor( uint256 _messageId) {
        messageId = _messageId;
    }
}
