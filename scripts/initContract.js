import { ethers } from 'ethers'
import NFT from '../artifacts/contracts/Nft.sol/Test.json'

import {
    nftaddress
  } from '../config'
async function initContract(){
  try {
    
    let connection = window.ethereum;
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    var signerAdress = await signer.getAddress();
    var nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    return {signerAdress,nftContract}

  } catch (error) {

    var signerAdress = null
    var nftContract= null

    return {signerAdress,nftContract}
  }
    
}
export default initContract;
