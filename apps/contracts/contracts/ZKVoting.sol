//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract ZKVoting {
    //pollId --> proposal text
    mapping(uint256 => string) public polls;
    uint256[] public pollIds;

    function addPoll(uint256 _pollId, string memory _proposal) public {
        polls[_pollId] = _proposal;
        pollIds.push(_pollId);
    }

    function getPollIds() public view returns (uint256[] memory) {
        return pollIds;
    }
}
