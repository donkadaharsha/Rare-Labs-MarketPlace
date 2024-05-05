import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GetIpfsUrlFromPinata } from '../utils';
import Navbar from './Navbar'; // Importing Navbar component

import MarketplaceJSON from '../Marketplace.json';

export default function NFTPage() {
  const [data, setData] = useState({});
  const [dataFetched, setDataFetched] = useState(false);
  const [message, setMessage] = useState('');
  const [currAddress, setCurrAddress] = useState('0x');
  const [transactionHash, setTransactionHash] = useState('');

  // Function to fetch NFT data from blockchain and IPFS
  async function getNFTData(tokenId) {
    try {
      const ethers = require('ethers');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer
      );
      let tokenURI = await contract.tokenURI(tokenId);
      const listedToken = await contract.getListedTokenForId(tokenId);
      tokenURI = GetIpfsUrlFromPinata(tokenURI);
      let meta = await axios.get(tokenURI);
      meta = meta.data;
      let item = {
        price: meta.price,
        tokenId: tokenId,
        seller: listedToken.seller,
        owner: listedToken.owner,
        image: meta.Image,
        name: meta.name,
        description: meta.description,
        currentlyListed: listedToken.currentlyListed
      };
      setData(item);
      setDataFetched(true);
      setCurrAddress(addr);
    } catch (error) {
      console.error('Error fetching NFT data:', error);
    }
  }

  // Function to handle NFT purchase
  async function buyNFT(tokenId) {
    try {
      const ethers = require('ethers');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer
      );
      const salePrice = ethers.utils.parseUnits(data.price, 'ether');
      setMessage('Transaction may take 2-5 minutes to process. Please wait');
      let transaction = await contract.executeSale(tokenId, {
        value: salePrice
      });
      await transaction.wait();
      alert('NFT bought!!!!!');
      setTransactionHash(transaction.hash)
      setMessage('');
    } catch (error) {
      console.error('Error buying NFT:', error);
      alert('Please check your wallet connection or wallet balance');
    }
  }

  const params = useParams();
  const tokenId = params.tokenId;

  // Fetch NFT data if not fetched already
  useEffect(() => {
    if (!dataFetched) {
      getNFTData(tokenId);
    }
  }, [dataFetched, tokenId]);

  return (
    <div className="min-h-screen from-gray-800 to-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto flex justify-center items-center mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <img
              src={typeof data.image === 'string' ? data.image : ''}
              alt={data.name}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="flex flex-col justify-center items-center md:items-start">
            <h2 className="text-4xl font-bold mb-4 text-black">{data.name}</h2>
            <p className="text-lg mb-6 text-black">{data.description}</p>
            <div className="grid grid-cols-2 gap-2 text-black">
              <div>
                <p className="text-lg text-black">Price of NFT:</p>
                <p className="text-lg font-bold text-black">{data.price} ETH</p>
              </div>
              <div>
                <p className="text-lg text-black">Owner details:</p>
                <p className="text-lg text-black">{data.owner}</p>
              </div>
              <div>
                <p className="text-lg text-black">Seller details:</p>
                <p className="text-lg text-black">{data.seller}</p>
              </div>
            </div>
            <div className="mt-8">
            {currAddress !== data.owner && currAddress !== data.seller ? (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md text-lg"
                  onClick={() => buyNFT(tokenId)}
                >
                  Buy this NFT
                </button>
              ) : (
                <div className="text-black text-lg">THIS IS YOUR NFT</div>
              )}
              <div className="mt-4 text-green text-lg">{message}</div>
              <div>{transactionHash}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
