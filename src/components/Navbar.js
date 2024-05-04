import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [connected, setConnected] = useState(false);
  const [currAddress, setCurrAddress] = useState('0x');
  const location = useLocation();

  async function getAddress() {
    try {
      const ethers = require("ethers");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      setCurrAddress(addr);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  }

  async function updateButton() {
    try {
      const ethereumButton = document.querySelector('.enableEthereumButton');
      ethereumButton.textContent = "Connected";
      ethereumButton.classList.remove("hover:bg-blue-70", "bg-blue-500");
      ethereumButton.classList.add("hover:bg-green-700", "bg-green-500");
    } catch (error) {
      console.error("Error updating button:", error);
    }
  }

  async function connectWebsite() {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0xaa36a7') {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      }
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      updateButton();
      getAddress();
      window.location.replace(location.pathname);
    } catch (error) {
      console.error("Error connecting:", error);
    }
  }

  useEffect(() => {
    try {
      const val = window.ethereum.isConnected();
      if (val) {
        getAddress();
        setConnected(true);
        updateButton();
      }
      window.ethereum.on('accountsChanged', function (accounts) {
        window.location.replace(location.pathname);
      });
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, []);

  const NavItem = ({ to, text, currentPath }) => {
    const isActive = currentPath === to;
    return (
      <li>
        <Link
          to={to}
          className={`font-bold text-lg ${isActive ? "border-b-2 border-white" : "hover:text-gray-300"}`}
        >
          {text}
        </Link>
      </li>
    );
  };

  return (
    <>
    <nav className="text-black-900 mt-5">
      <div className="container mx-auto flex justify-between items-center py-3 text-white">
        <Link to="/" className="font-bold text-7xl text-white">Rare Labs</Link>
        <ul className="flex items-center space-x-8">
          <NavItem to="/" text="Marketplace" currentPath={location.pathname} />
          <NavItem to="/sellNFT" text="List My NFT" currentPath={location.pathname} />
          <li>
            <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={connectWebsite}>
              {connected ? "Connected" : "Connect Wallet"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
    {connected && (
      <div className="container mx-auto text-left text-sm mt-1 ml-17 text-green-400">
        {`Connected to ${currAddress.substring(0, 30)}...`}
      </div>
    )}
  </>
  
    
  );
}

export default Navbar;
