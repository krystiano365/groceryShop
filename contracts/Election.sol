pragma solidity ^0.5.0;

contract Election {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    address payable public owner = 0x97496425BE79D8fabC7A103322F31774E482f620;
    bool public sold = false;
    string public salesDescription = 'Volvo V40 HF 56 32';
    uint price = 1 ether;

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;
    uint public candidatesCount = 0;

    constructor() Election() payable public {
        // owner = msg.sender;

        addCandidate("person 1");
        addCandidate("person 2");
        //addCandidate("Bromislaw Koromowski");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public payable{
        // require(
        //     !voters[msg.sender],
        //     "you have already voted"
        // );
        require(
            (_candidateId > 0 && _candidateId <= candidatesCount),
            "there is no candidate with such ID"
        );
        // require(
        //     msg.value >= price,
        //     "not enough funds to vote"
        // );
        if(msg.value >= price) {
            owner.transfer(address(this).balance);
            //owner = msg.sender;
            sold = true;
        } else {
            revert("sorry! not enough money");
        }
        // address payable add = msg.sender;
        // add.transfer(10**18);

        voters[msg.sender] = true;

        candidates[_candidateId].voteCount++;
    }
}