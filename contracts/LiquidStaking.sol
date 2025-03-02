// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./StakingToken.sol";

contract LiquidStaking {
    IERC20 public baseToken;
    StakingToken public stakingToken;

    uint256 public totalStakedTokens;
    uint256 public totalStakingTokens;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardAdded(uint256 rewardAmount);

    constructor(address _baseToken, address _stakingToken) {
        baseToken = IERC20(_baseToken);
        stakingToken = StakingToken(_stakingToken);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        baseToken.transferFrom(msg.sender, address(this), amount);

        uint256 stakingAmount = totalStakedTokens == 0 || totalStakingTokens == 0
            ? amount
            : (amount * totalStakingTokens) / totalStakedTokens;

        totalStakedTokens += amount;
        totalStakingTokens += stakingAmount;

        stakingToken.mint(msg.sender, stakingAmount);
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 stakingAmount) external {
        require(stakingAmount > 0, "Amount must be greater than 0");

        uint256 baseAmount = (stakingAmount * totalStakedTokens) / totalStakingTokens;
        totalStakedTokens -= baseAmount;
        totalStakingTokens -= stakingAmount;

        stakingToken.burn(msg.sender, stakingAmount);
        baseToken.transfer(msg.sender, baseAmount);

        emit Unstaked(msg.sender, baseAmount);
    }

    function addReward(uint256 rewardAmount) external {
        require(rewardAmount > 0, "Amount must be greater than 0");
        baseToken.transferFrom(msg.sender, address(this), rewardAmount);
        totalStakedTokens += rewardAmount;
        emit RewardAdded(rewardAmount);
    }
}
