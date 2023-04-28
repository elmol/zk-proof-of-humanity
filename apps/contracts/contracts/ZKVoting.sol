//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ZKProofOfHumanity.sol";

contract ZKVoting {

    mapping(uint256 => string) public polls;
    uint256[] public keys;


    constructor( uint256 _pollId, string memory _proposal ) {
        polls[_pollId] = _proposal;
        keys.push(_pollId);
    }

    function addToMapping(uint256 _pollId, string memory _proposal) public {
        polls[_pollId] = _proposal;
        keys.push(_pollId);
    }

    function getAllKeys() public view returns (uint256[] memory) {
        return keys;
    }
}
