// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./StakingToken.sol";

contract LiquidStaking is Ownable {
    IERC20 public baseToken;
    StakingToken public stakingToken;

    uint256 public totalStakedTokens;
    uint256 public totalStakingTokens;

    mapping(address => uint256) public stakerBalances;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardAdded(uint256 rewardAmount);

    constructor(address _baseToken, address _stakingToken) Ownable(msg.sender) {
        baseToken = IERC20(_baseToken);
        stakingToken = StakingToken(_stakingToken);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        uint256 stakingAmount = (totalStakedTokens == 0 || totalStakingTokens == 0)
            ? amount
            : (amount * totalStakingTokens) / totalStakedTokens;
        require(stakingAmount > 0, "Calculated staking amount must be > 0");

        totalStakedTokens += amount;
        totalStakingTokens += stakingAmount;
        stakerBalances[msg.sender] += amount;

        baseToken.transferFrom(msg.sender, address(this), amount);
        stakingToken.mint(msg.sender, stakingAmount);

        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 stakingAmount) external {
        require(stakingAmount > 0, "Amount must be greater than 0");
        require(totalStakingTokens >= stakingAmount, "Insufficient total staking tokens");

        uint256 baseAmount = (stakingAmount * totalStakedTokens) / totalStakingTokens;
        require(totalStakedTokens >= baseAmount, "Insufficient total staked tokens");
        require(stakerBalances[msg.sender] >= baseAmount, "Insufficient staker balance");

        totalStakedTokens -= baseAmount;
        totalStakingTokens -= stakingAmount;
        stakerBalances[msg.sender] -= baseAmount;

        stakingToken.burn(msg.sender, stakingAmount);
        baseToken.transfer(msg.sender, baseAmount);

        emit Unstaked(msg.sender, baseAmount);
    }

    function addReward(uint256 rewardAmount) external onlyOwner {
        require(rewardAmount > 0, "Amount must be greater than 0");
        totalStakedTokens += rewardAmount;
        baseToken.transferFrom(msg.sender, address(this), rewardAmount);
        emit RewardAdded(rewardAmount);
    }
}
