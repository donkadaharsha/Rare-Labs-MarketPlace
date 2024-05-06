import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function Marketplace() {
const sampleData = [
    {
        "name": "NFT1",
        "description": "NFT number 1",
        "image":"https://gateway.pinata.cloud/ipfs/QmWhSeGQAGwEYAU48Bcf3sUsbX5ZCU8UzfBBsWubPCLZxE",
        "price":"0.03ETH",
        
    }
];
const [data, updateData] = useState(sampleData);
const [dataFetched, updateFetched] = useState(false);

async function getAllNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    let transaction = await contract.getAllNFTs()
    console.log(transaction)

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
        var tokenURI = await contract.tokenURI(i.tokenId);
        console.log("getting this tokenUri", tokenURI);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        console.log(tokenURI)
        let meta = await axios.get(tokenURI);
        console.log("meta",meta)
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.Image,  
            name: meta.name,
            description: meta.description,
            currentlyListed: i.currentlyListed
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
}

if(!dataFetched)
    getAllNFTs();

return (
    <div>
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-10">
            <div className="md:text-xl font-bold text-white">
               MARKETPLACE: CLICK ON THE NFT TO VIEW DETAILS OR TO BUY THE NFT
            </div>
            <div className="flex justify-around flex-wrap max-w-screen-xl text-center">
  {data.map((value, index) => {
    return <NFTTile data={value} key={index}></NFTTile>;
  })}
</div>

        </div> 
        <div className="md:text-l font-bold text-white">
            ***PLEASE WAIT FOR 5-10 MINUTES IF YOU ARE UNABLE TO VIEW LISTED ITEMS
            </div>           
    </div>
);

}