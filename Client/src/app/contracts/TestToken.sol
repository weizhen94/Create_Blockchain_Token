// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Token {
    // Mapping from address to balance
    mapping(address => uint256) private _balances;

    // Mapping from owner address and spender address to allowance
    mapping(address => mapping(address => uint256)) private _allowances;

    // Total supply of the token
    uint256 private _totalSupply;

    // Name of the token
    string private _name;

    // Symbol of the token
    string private _symbol;

    // Number of decimals the token uses
    uint8 private _decimals = 18;

    constructor(string memory name_, string memory symbol_, uint256 totalSupply_, address otherAddress) {
        _name = name_;
        _symbol = symbol_;
        _totalSupply = totalSupply_;

        require(totalSupply_ >= 10**18, "Total supply must be at least 1 token");

        uint256 otherAmount = totalSupply_ / 10;
        uint256 senderAmount = totalSupply_ - otherAmount;

        _balances[msg.sender] = senderAmount;
        _balances[otherAddress] = otherAmount;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(msg.sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(_balances[msg.sender] >= amount, "ERC20: transfer amount exceeds balance");

        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[msg.sender][spender] = amount;
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(_balances[sender] >= amount, "ERC20: transfer amount exceeds balance");
        require(_allowances[sender][msg.sender] >= amount, "ERC20: transfer amount exceeds allowance");

        _balances[sender] -= amount;
        _allowances[sender][msg.sender] -= amount;
        _balances[recipient] += amount;
        return true;
    }
}
