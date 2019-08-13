const Election = artifacts.require("./Election.sol");

contract("Election", (accounts) => {

    var electionInstance;

    it("Initilizes with two candidates", () => {
        return Election.deployed().then((instance) => {
            return instance.candidatesCount();
        }).then((count) => {
            assert.equal(count, 2);
        });
    });

    // Check the id, name and voteCount declarations of the candidate.
    it("It initilizes the candidates with the correct values", () => {
        return Election.deployed().then((instance) => {
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then((candidate) => {
            assert.equal(candidate[0], 1, "containes the corrrect ID");
            assert.equal(candidate[1], "Candidate 1", "containes the correct name");
            assert.equal(candidate[2], 0, "Containes the correct votes count");
            return electionInstance.candidates(2);
        }).then((candidate) => {
            assert.equal(candidate[0], 2, "Contains the correct ID");
            assert.equal(candidate[1], "Candidate 2", "contains the correct NAME");
            assert.equal(candidate[2], 0, "Containes the correct votes count");
        });

    });


    // Chek if the user = Account has already voted (or) not, test case.
    it("Allow a voter to cast a vote", () => {
        return Election.deployed().then((instance) => {
            electionInstance = instance;
            candidateId = 1;
            return electionInstance.vote(candidateId, { from: accounts[0]});
        }).then((receipt) => {
            assert.equal(receipt.logs.length, 1, "An event was triggered.");
            assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
            assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate Id is correct. ");
            return electionInstance.voters(accounts[0]);
        }).then((voted) => {
            assert(voted, "The voter was marked as voted");
            return electionInstance.candidates(candidateId);
        }).then((candidate) => {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "increments the candidates vote count");
        });
    });


    it("Throw an exception for invalid candidates", () => {
        return Election.deployed().then((instance) => {
            electionInstance = instance;
            return electionInstance.vote(99, { from: accounts[1] });
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, "Error message much contaon revert");
            return electionInstance.candidates(1);
        }).then((candidate1) => {
            var voteCount = candidate1[2];
            assert.equal(voteCount, 1, "Candidate 1 did not receive any votes.");
            return electionInstance.candidates(2);
        }).then((candidate2) => {
            var voteCount = candidate2[2];
            assert.equal(voteCount, 0, "Candidate 2 did not teceive any votes");
        });
    });


    it("Throw an exception for double voting", () => {
        return Election.deployed().then((instance) => {
            electionInstance = instance;
            candidateId = 2;
            electionInstance.vote(candidateId, { from: accounts[1] });
            return electionInstance.candidates(candidateId);
        }).then((candidate) => {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "accepts first vote");
            // try to vote again.
            return electionInstance.vote(candidateId, { from: accounts[1] });
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, "Error message much contaon revert");
            return electionInstance.candidates(1);
        }).then((candidate1) => {
            var voteCount = candidate1[2];
            assert.equal(voteCount, 1, "Candidate 1 did not receive any votes");
            return electionInstance.candidates(2);
        }).then((candidate2) => {
            var voteCount = candidate2[2];
            assert.equal(voteCount, 1, "Candidate 2 did not receive any votes");
        });
    });


});