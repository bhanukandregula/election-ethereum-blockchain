pragma solidity ^0.5.0;

contract Election {

    // Model a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store accounts that have voted.
    mapping(address => bool) public voters;

    // Store Candidates
    // Fetch Candidates
    mapping(uint => Candidate) public candidates;

    // Store candidates Count
    uint public candidatesCount;

    // voted event.
    event votedEvent(
        uint indexed _candidateId
    );

    // Constructor
    constructor() public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    // Add a candidate to the mapping.
    function addCandidate(string memory _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {

        // Require that thay haven't voted before.
        require(!voters[msg.sender], "");

        // Require a valid candidate.
        require(_candidateId > 0 && _candidateId <= candidatesCount, "");

        // Record that voter has voted.
        voters[msg.sender] = true;

        // Increase the vote count of specific candidate.
        candidates[_candidateId].voteCount ++;

        // trigger voted event.
        // Keep emit key word, to emit the events in cirremnt solidity version.
        emit votedEvent(_candidateId);
    }

}