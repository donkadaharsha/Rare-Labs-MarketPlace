import Navbar from "./Navbar";
import { useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function NFTPage (props) {

const [data, updateData] = useState({});
const [dataFetched, updateDataFetched] = useState(false);
const [message, updateMessage] = useState("");
const [currAddress, updateCurrAddress] = useState("0x");

async function getNFTData(tokenId) {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    var tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getListedTokenForId(tokenId);
    tokenURI = GetIpfsUrlFromPinata(tokenURI);
    let meta = await axios.get(tokenURI);
    meta = meta.data;
    console.log(listedToken);

    let item = {
        price: meta.price,
        tokenId: tokenId,
        seller: listedToken.seller,
        owner: listedToken.owner,
        image: meta.Image,
        name: meta.name,
        description: meta.description,
    }
    console.log(item);
    updateData(item);
    updateDataFetched(true);
    console.log("address", addr)
    updateCurrAddress(addr);
}

async function buyNFT(tokenId) {
    try {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
        const salePrice = ethers.utils.parseUnits(data.price, 'ether')
        updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
        //run the executeSale function
        let transaction = await contract.executeSale(tokenId, {value:salePrice});
        await transaction.wait();

        alert('You successfully bought the NFT!');
        updateMessage("");
    }
    catch(e) {
        alert("Upload Error"+e)
    }
}


    const params = useParams();
    const tokenId = params.tokenId;
    console.log("data", data)
    if(!dataFetched)
        getNFTData(tokenId);
    if(typeof data.image == "string")
        data.image = GetIpfsUrlFromPinata(data.image);

        return (
            <div className="min-h-screen  from-gray-800 to-gray-900 text-white">
  <Navbar />
  <div className="container mx-auto flex justify-center items-center mt-20">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <img src={data.image} alt={data.name} className="w-full rounded-lg shadow-lg" />
      </div>
      <div className="flex flex-col justify-center items-center md:items-start ">
        <h2 className="text-4xl font-bold mb-4 text-black">{data.name}</h2>
        <p className="text-lg mb-6 text-black">{data.description}</p>
        <div className="grid grid-cols-2 gap-2 text-black">
          <div>
            <p className="text-lg text-black">Price:</p>
            <p className="text-lg font-bold text-black">{data.price} ETH</p>
          </div>
          <div>
            <p className="text-lg" text-black >Owner:</p>
            <p className="text-lg text-black">{data.owner}</p>
          </div>
          <div>
            <p className="text-lg text-black">Seller:</p>
            <p className="text-lg text-black">{data.seller}</p>
          </div>
        </div>
        <div className="mt-8">
          {currAddress !== data.owner && currAddress !== data.seller ? (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md text-lg" onClick={() => buyNFT(tokenId)}>Buy this NFT</button>
          ) : (
            <div className="text-black text-lg">THIS IS YOUR NFT</div>
          )}
          <div className="mt-4 text-green text-lg">{message}</div>
        </div>
      </div>
    </div>
  </div>
</div>

          );
          
    
}