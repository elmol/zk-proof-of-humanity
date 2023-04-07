//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ZKProofOfHumanity.sol";

contract PostLike {
    ZKProofOfHumanity public zKProofOfHumanity;
    string public message = "The house is in order";

    constructor(address zkPoHAddress) {
        zKProofOfHumanity = ZKProofOfHumanity(zkPoHAddress);
    }
}
