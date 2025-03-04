import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { LiquidStaking, StakingToken } from "../typechain-types";

describe("LiquidStaking", function () {
  let deployer: Signer, user1: Signer, user2: Signer;
  let baseToken: StakingToken, stakingToken: StakingToken, liquidStaking: LiquidStaking;

  beforeEach(async function () {
    [deployer, user1, user2] = await ethers.getSigners();

    const BaseToken = await ethers.getContractFactory("StakingToken");
    baseToken = (await BaseToken.deploy(await deployer.getAddress())) as unknown as StakingToken;
    await baseToken.waitForDeployment();

    const StakingToken = await ethers.getContractFactory("StakingToken");
    stakingToken = (await StakingToken.deploy(await deployer.getAddress())) as unknown as StakingToken;
    await stakingToken.waitForDeployment();

    const LiquidStaking = await ethers.getContractFactory("LiquidStaking");
    liquidStaking = (await LiquidStaking.deploy(
      await baseToken.getAddress(),
      await stakingToken.getAddress()
    )) as unknown as LiquidStaking;
    await liquidStaking.waitForDeployment();

    await stakingToken.connect(deployer).transferOwnership(await liquidStaking.getAddress());
  });

  it("Should allow users to stake tokens", async function () {
    const stakeAmount = ethers.parseUnits("100", 18);

    await baseToken.connect(deployer).mint(await user1.getAddress(), stakeAmount);
    await baseToken.connect(user1).approve(await liquidStaking.getAddress(), stakeAmount);
    await expect(liquidStaking.connect(user1).stake(stakeAmount))
      .to.emit(liquidStaking, "Staked")
      .withArgs(await user1.getAddress(), stakeAmount);

    expect(await baseToken.balanceOf(await user1.getAddress())).to.equal(0);
    expect(await stakingToken.balanceOf(await user1.getAddress())).to.be.gt(0);
  });

  it("Should allow users to unstake tokens", async function () {
    const stakeAmount = ethers.parseUnits("100", 18);

    await baseToken.connect(deployer).mint(await user1.getAddress(), stakeAmount);
    await baseToken.connect(user1).approve(await liquidStaking.getAddress(), stakeAmount);
    await liquidStaking.connect(user1).stake(stakeAmount);

    const stakingBalance = await stakingToken.balanceOf(await user1.getAddress());
    await stakingToken.connect(user1).approve(await liquidStaking.getAddress(), stakingBalance);

    await expect(liquidStaking.connect(user1).unstake(stakingBalance))
      .to.emit(liquidStaking, "Unstaked")
      .withArgs(await user1.getAddress(), stakeAmount);

    expect(await baseToken.balanceOf(await user1.getAddress())).to.equal(stakeAmount);
    expect(await stakingToken.balanceOf(await user1.getAddress())).to.equal(0);
  });

  it("Should allow the owner to add rewards", async function () {
    const rewardAmount = ethers.parseUnits("50", 18);

    await baseToken.connect(deployer).mint(await deployer.getAddress(), rewardAmount);
    await baseToken.connect(deployer).approve(await liquidStaking.getAddress(), rewardAmount);
    await expect(liquidStaking.connect(deployer).addReward(rewardAmount))
      .to.emit(liquidStaking, "RewardAdded")
      .withArgs(rewardAmount);
  });

  it("Should fail when non-owner tries to add rewards", async function () {
    const rewardAmount = ethers.parseUnits("50", 18);

    await baseToken.connect(deployer).mint(await user1.getAddress(), rewardAmount);
    await baseToken.connect(user1).approve(await liquidStaking.getAddress(), rewardAmount);

    await expect(liquidStaking.connect(user1).addReward(rewardAmount))
      .to.be.revertedWithCustomError(liquidStaking, "OwnableUnauthorizedAccount")
      .withArgs(await user1.getAddress());
  });
});
