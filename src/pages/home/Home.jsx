import React,{ useState,useEffect} from 'react'
import './home.css'
import item from '../../assets/item1.png'

import initContract from '../../../scripts/initContract'
import { ethers } from 'ethers'
import getProof from '../../../scripts/merkleTree'

const Home = () => {
  const [supply,setSupply] = useState(null)
  const [mintedSupply, setMintedSupply] = useState(null)
  const [presale,setPreSale] = useState(false)
  const [publicsale,setPublicSale] = useState(false)
  const [ownerMintedBalance,setOwnerMintedBalance] = useState(null)

  var nftContract;
  var signerAdress;
  var ownerBalance;
  var IS_PRESALE_ACTIVE;
  var IS_PULICSALE_ACTIVE;
  var _totalSupply;
  var mintPrice;
  var _mintedSupply 

  async function checkMintStart(){
    var _initContract = await initContract()
    signerAdress = _initContract.signerAdress
    nftContract = _initContract.nftContract

    if(nftContract != null){
      IS_PRESALE_ACTIVE = await nftContract.IS_PRESALE_ACTIVE()
      IS_PULICSALE_ACTIVE = await nftContract.IS_SALE_ACTIVE()
      setPreSale(IS_PRESALE_ACTIVE)
      setPublicSale(IS_PULICSALE_ACTIVE)

      ownerBalance = await nftContract.balanceOf(signerAdress)
      setOwnerMintedBalance(ownerBalance.toNumber())
      mintPrice = await nftContract.MINT_PRICE()
      
      _totalSupply = await nftContract.TOTAL_SUPPLY()
      _totalSupply = _totalSupply.toNumber()
      setSupply(_totalSupply)
      _mintedSupply = await nftContract.totalSupply()
      _mintedSupply = _mintedSupply.toNumber()
      setMintedSupply(_mintedSupply)
    }

  }
  
 const Button = () => (
    
    <>
    <div className="item-content-buy">
    {presale && !publicsale  && ownerMintedBalance < 2 &&
    <button onClick={preMintFunction} className="primary-btn"> Presale Mint </button> } 
       
    {publicsale && !presale && ownerMintedBalance <2 &&
    <button onClick={publicMintFunction} className="primary-btn">Publicsale Mint </button>} 

    {!publicsale && !presale && ownerMintedBalance < 2 &&
    <div className="item-content-title"><p>Sale not started</p></div>} 

    { ownerMintedBalance == 2 &&
    <div className="item-content-title"><p>Already minted</p></div>} 

    </div>
    </>
   )


  
 async function preMintFunction()  {
   
  const quantity = document.getElementById("quantity").value
  const addressProof = getProof(signerAdress)
  mintPrice = mintPrice/10**18
  var price = mintPrice * quantity
  price = ethers.utils.parseEther(price.toString()) 
  var balance = await nftContract.getCurrentMintCount(signerAdress)

  const transaction = await nftContract.presaleMint(signerAdress,quantity,"2",addressProof,{ value: price })
  await transaction.wait().then(function(receipt) {
    console.log(receipt)
});
}

async function publicMintFunction()  {
  const quantity = document.getElementById("quantity").value

  mintPrice = mintPrice/10**18
  var price = mintPrice * quantity
  price = ethers.utils.parseEther(price.toString()) 
  const transaction = await nftContract.publicSaleMint({ value: price })
  await transaction.wait().then(function(receipt) {
    console.log(receipt)
});
}

useEffect(() => {
  checkMintStart()
}, []);
  return( 
      <div className='item section__padding'>
        
        <div className="item-image">
          <img src={item} alt="item" />
        </div>
          <div className="item-content">
            <div className="item-content-title">
              <h1>NFT Collection</h1>
              <p>Price <span>0.01 ETH</span> ‧ {supply - mintedSupply} of {supply} available</p>
            </div>
           
            <div className="item-content-detail">
            <input type="number" max="2"  id="quantity"/>
            </div>
           {mintedSupply != supply
           ?
           <Button/>  
          :
          <div className="item-content-title"><p>Sold Out</p></div>}
                    
            
          </div>
      </div>
  )
};

export default Home;
