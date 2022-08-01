import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './Navbar';
import Home from './Home.js'
import Create from './Create.js'
import MyListedItems from './MyListedItems.js'
import MyToken from './MyToken.js'
import UserAbi from '../contractsData/User.json'
import UserAddress from '../contractsData/User-address.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Spinner } from 'react-bootstrap'
import './App.css';
import Registration from "./Registration";
import Admin from "./Admin";

import Button from '@material-ui/core/Button';
import ModalDialog from './ModalDialog.js';

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [user, setUser] = useState({})
  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer

    const signer = provider.getSigner()

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    loadContracts(signer)
  }
  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const user = new ethers.Contract(UserAddress.address, UserAbi.abi, signer)
    setUser(user)
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    setNFT(nft)
    setLoading(false)
  }

  
 
  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account} />
        </>
        <div >
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home user={user} nft={nft} />
              } />
              <Route path="/create" element={
                <Create user={user} nft={nft} />
              } />
              <Route path="/listeditems" element={
                <MyListedItems user={user} nft={nft} account={account} />
              } />
              <Route path="/tokens" element={
                <MyToken user={user} nft={nft} account={account} />
              } />
              <Route path="/admins" element={
                <Admin user={user} nft={nft} account={account} />
              } />

            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;
