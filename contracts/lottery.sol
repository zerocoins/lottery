pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;

    constructor () public {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > 0.1 ether); // this will auto convert to wei
        players.push(msg.sender);
    }

    function random() private view returns (uint){ // uint == uint256
        //sha3();
        return uint(keccak256(block.difficulty, now, players));
    }

    function pickWinner() public restricted  {
        // pick a random player
        uint index = random() % players.length;
        address lucky_winner = players [index];
        // send all the money (balance) from this contract to the lucky winning player
        lucky_winner.transfer(this.balance);
        resetPlayers();
    }

    modifier restricted() {
        require (msg.sender == manager);
        _;
    }

    function resetPlayers() private {
        players = new address[](0);
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }
}
