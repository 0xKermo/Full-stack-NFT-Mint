const hre = require("hardhat");

async function main() {

  const NFT = await hre.ethers.getContractFactory("Test");
  const nft = await NFT.deploy("Test","TST","0xd4453790033a2bd762f526409b7f358023773723d9e9bc42487e4996869162b6");
  await nft.deployed();
  console.log("nft deployed to:", nft.address);
}
main()