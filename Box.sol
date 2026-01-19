// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

// The contract the DAO will control
contract Box is Ownable {
    uint256 public value;

    event ValueChanged(uint256 newValue);

    constructor() Ownable(msg.sender) {}

    function store(uint256 newValue) external onlyOwner {
        value = newValue;
        emit ValueChanged(newValue);
    }
}
