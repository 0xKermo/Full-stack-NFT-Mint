describe("NFT", function() {
  it("NFT mint", async function() {
    const NFT = await ethers.getContractFactory("Test");
    const nft = await NFT.deploy("test","tst","0xb0d63c211bd098f173092331334aa442a0e7cae931a869fd9795ba393e29bd47")
    await nft.deployed()
    const nftContractAddress = nft.address


  

  })
})