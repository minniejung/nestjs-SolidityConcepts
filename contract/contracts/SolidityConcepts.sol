// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SolidityConcepts {
    uint256 public constant FIXED_VALUE = 100;
    address public immutable owner;
    uint256 public value = 50;

    constructor() {
        owner = msg.sender;
    }

    event ValueChanged(uint256 oldValue, uint256 newValue);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function checkValue(uint256 _val) public pure returns (string memory) {
        return
            _val > 100
                ? "Value is greater than 100"
                : _val == 100
                    ? "Value is exactly 100"
                    : "Value is less than 100";
    }

    function sumUpTo(uint256 _val) public pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 1; i <= _val; i++) {
            sum += i;
        }
        return sum;
    }

    function updateValue(uint256 _val) public {
        uint256 oldValue = value;
        value = _val;
        emit ValueChanged(oldValue, value);
    }

    function ownerFunction() public view onlyOwner returns (string memory) {
        return "Hello, Owner!";
    }

    function sendEther(address payable _addr) public payable {
        require(msg.value > 0, "Must send ether");
        // _addr.transfer(msg.value); // transfer
        (bool success, ) = _addr.call{value: msg.value}(""); // call
        require(success, "Transfer failed");
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withDraw() public onlyOwner {
        // payable(msg.sender).transfer(address(this).balance); // transfer
        (bool success, ) = msg.sender.call{value: address(this).balance}(""); // call
        require(success, "Transfer failed");
    }

    receive() external payable {}
}
