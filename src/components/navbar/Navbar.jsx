import React,{ useState,useEffect} from 'react'
import './navbar.css'
import {  Link } from "react-router-dom";
import Web3Modal from "web3modal"
import { ethers } from 'ethers'

 const Navbar = () => {
   const [user,setUser] = useState(null)
   
  const connectWallet = async () => {
   if(typeof window !== "undefined" && typeof ethereum !== "undefined") {
     try {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      
      const signer = provider.getSigner();
      const signerAdress = await signer.getAddress();
      setUser(signerAdress)
      window.location.reload()
     } catch (error) {
       console.log(error.message)
     }
   }else{
     console.log("Make sure you have Metamask İnsatalled!")
   }
  }
  useEffect(async () => {
    try {
      let connection = window.ethereum;
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner();
      const signerAdress = await signer.getAddress();
      setUser(signerAdress)
    } catch (error) {
      setUser(null)
    }
   
  }, []); 
  return (
    <div className='navbar'>
      <div className="navbar-links">
        <div className="navbar-links_logo">
          <Link to="/"> 
            <h1>NFT MİNT</h1>
          </Link>
        </div>
     
      </div>
      <div className="navbar-sign">
      {user ? (
        <>
        <p>{user}</p>
        </>
      ): (
        <>
        
          <button type='button' onClick={connectWallet} className='secondary-btn'>Connect Wallet</button>
       
        </>
      )}
      </div>
    
    </div>
  )
}

export default Navbar
