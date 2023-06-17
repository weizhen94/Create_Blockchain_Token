// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AMM {
    // Set a fee rate of 5%
    uint public constant FEE_RATE = 5;

    mapping(address => mapping(address => uint)) public pairs;
    address public feeRecipient;

    constructor(address _feeRecipient) {
        feeRecipient = _feeRecipient;
    }

    function addLiquidity(address tokenA, address tokenB, uint amountA, uint amountB) public {
        ERC20 token1 = ERC20(tokenA);
        ERC20 token2 = ERC20(tokenB);

        require(token1.transferFrom(msg.sender, address(this), amountA), "Transfer of token A failed");
        require(token2.transferFrom(msg.sender, address(this), amountB), "Transfer of token B failed");

        pairs[tokenA][tokenB] += amountA;
        pairs[tokenB][tokenA] += amountB;
    }

    function swap(address tokenIn, address tokenOut, uint amountIn, uint slippageAmount) public {
        require(pairs[tokenIn][tokenOut] > 0 && pairs[tokenOut][tokenIn] > 0, "This trading pair does not exist");

        ERC20 inputToken = ERC20(tokenIn);
        require(inputToken.transferFrom(msg.sender, address(this), amountIn), "Transfer of input token failed");

        // Apply fee
        uint feeAmount = (amountIn * FEE_RATE) / 100;
        uint amountInAfterFee = amountIn - feeAmount;

        uint amountOut = getOutputAmount(tokenIn, tokenOut, amountInAfterFee, slippageAmount);

        ERC20 outputToken = ERC20(tokenOut);
        require(outputToken.transfer(msg.sender, amountOut), "Transfer of output token failed");

        // Transfer fee to the fee recipient
        require(inputToken.transfer(feeRecipient, feeAmount), "Transfer of fee failed");

        pairs[tokenIn][tokenOut] += amountInAfterFee;
        pairs[tokenOut][tokenIn] -= amountOut;
    }

    function getOutputAmount(address tokenIn, address tokenOut, uint amountIn, uint slippageAmount) public view returns (uint) {
        uint inputReserve = pairs[tokenIn][tokenOut];
        uint outputReserve = pairs[tokenOut][tokenIn];

        require(amountIn <= inputReserve, "Not enough liquidity");

        uint amountOut = (amountIn * outputReserve) / inputReserve; // formula for calculating output amount
        uint minAmountOut = (amountOut * (100 - (FEE_RATE + slippageAmount))) / 100;
        
        require(amountOut >= minAmountOut, "Slippage exceeded");

        return amountOut;
    }
}
