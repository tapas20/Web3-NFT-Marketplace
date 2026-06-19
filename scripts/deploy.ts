import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  console.log(`Starting deployment at ${currentTimestampInSeconds}`);

  // Deploy ChainMarket
  const ChainMarket = await ethers.getContractFactory("ChainMarket");
  const chainMarket = await ChainMarket.deploy();

  await chainMarket.waitForDeployment();
  const address = await chainMarket.getAddress();

  console.log(`ChainMarket deployed to: ${address}`);
  
  // Also log the deployer
  const [deployer] = await ethers.getSigners();
  console.log(`Deployed by: ${deployer.address}`);
  console.log(`Please copy this contract address to your .env file as NEXT_PUBLIC_CONTRACT_ADDRESS`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
