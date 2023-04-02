//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./IProofOfHumanity.sol";

/**
 *  @title ProofOfHumanityMock
 *  A mock contract for ProofOfHumanity used for testing
 */
contract ProofOfHumanityMock is IProofOfHumanity {
    mapping(address => bool) public humans;

    /** @dev Allow to directly add new submissions to the list as a part of the seeding event.
     *  @param _submissionID The addresses of newly added submissions.
     */
    function addSubmissionManually(address _submissionID) public {
        humans[_submissionID] = true;
    }

    /** @dev Returns true if the submission is registered and not expired.
     *  @param _submissionID The address of the submission.
     *  @return Whether the submission is registered or not.
     */
    function isRegistered(address _submissionID) public view override returns (bool) {
        return humans[_submissionID];
    }

    /** @dev Allow to directly remove submissions to the list.
     *  @param _submissionID The addresses to remove.
     */
    function unRegister(address _submissionID) public {
        humans[_submissionID] = false;
    }
}
