//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ZKProofOfHumanity.sol";

contract ZKVoting {
 
    string public message = "Voting system for president";
    uint256 public messageId;
    mapping(uint256 => string) public polls;
    uint256[] public keys;


    constructor( uint256 _messageId ) {
        messageId = _messageId;
        polls[_messageId] = message;
        keys.push(_messageId);
    }

    function addToMapping(uint256 _messageId, string memory _message) public {
        polls[_messageId] = _message;
        keys.push(_messageId);
    }

    function getAllKeys() public view returns (uint256[] memory) {
        return keys;
    }
}
