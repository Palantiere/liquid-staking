import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const BaseToken = await ethers.getContractFactory("StakingToken");
  const baseToken = await BaseToken.deploy(deployer.address);
  await baseToken.waitForDeployment();
  console.log("BaseToken deployed to:", await baseToken.getAddress());

  const StakingToken = await ethers.getContractFactory("StakingToken");
  const stakingToken = await StakingToken.deploy(deployer.address);
  await stakingToken.waitForDeployment();
  console.log("StakingToken deployed to:", await stakingToken.getAddress());

  const LiquidStaking = await ethers.getContractFactory("LiquidStaking");
  const liquidStaking = await LiquidStaking.deploy(
    await baseToken.getAddress(),
    await stakingToken.getAddress()
  );
  await liquidStaking.waitForDeployment();
  console.log("LiquidStaking deployed to:", await liquidStaking.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
