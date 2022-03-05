const hre = require("hardhat");

async function main() {

  const NFT = await hre.ethers.getContractFactory("Test");
  const nft = await NFT.deploy("Test","TST","merkle root");
  await nft.deployed();
  console.log("nft deployed to:", nft.address);
}
main()