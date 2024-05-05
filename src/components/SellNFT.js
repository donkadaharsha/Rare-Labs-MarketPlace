import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from '../Marketplace.json';
import { useLocation } from "react-router";

export default function SellNFT () {
    const [formParams, updateFormParams] = useState({ name: '', description: '', price: ''});
    const [fileURL, setFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const [transactionHash, setTransactionHash] = useState('');
    const location = useLocation();

    async function OnChangeFile(e) {
        var file = e.target.files[0];

        try{
            const response = await uploadFileToIPFS(file);
            if(response.success === true){
                console.log("Uploaded image to pinata:", response.pinataURL)
                setFileURL(response.pinataURL)
            }
        }catch(e){
            console.log("Error during file upload", e)
        }
    }

    async function uploadMetadataToIPFS(){
        const {name, description, price} = formParams;
        if(!name || !description || !price || !fileURL)
            return;

        const nftJSON ={
            name, description, price, Image:fileURL
        };

        try{
            const response = await uploadJSONToIPFS(nftJSON);
            if(response.success === true){
                console.log("Uploaded Json to Pinata: ", response);
                return response.pinataURL
            }
        }catch(e){
            console.log("error uploading JSON:", e)
        }
    }

    async function listNFT(e){
        e.preventDefault();

        try{
            const metadataURL = await uploadMetadataToIPFS();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            updateMessage("Please wait ... uploading");

            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer);

            const price = ethers.utils.parseUnits(formParams.price, 'ether')
            let listingPrice = await contract.getListPrice();
            listingPrice = listingPrice.toString();

            console.log(listingPrice)
            console.log(metadataURL)
            let transaction = await contract.createToken(metadataURL, price, {value: listingPrice});
            await transaction.wait();
            setTransactionHash(transaction.hash)
            alert("Listed")
            updateMessage("");
            updateFormParams({name:'', description:'', price:''})
        }catch(e){
            alert("Upload error", e)
        }
    }

    return (
        <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center mt-10">
          <form className="bg-white shadow-lg rounded-lg p-8 max-w-md ">
            <h3 className="text-center text-3xl font-bold text-black mb-8">Enter NFT details</h3>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Name of the NFT</label>
              <input
                id="name"
                type="text"
                placeholder="Enter NFT Name"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-black"
                onChange={e => updateFormParams({ ...formParams, name: e.target.value })}
                value={formParams.name}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                id="description"
                rows="4"
                placeholder="Enter NFT Description"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-black"
                onChange={e => updateFormParams({ ...formParams, description: e.target.value })}
                value={formParams.description}
              ></textarea>
            </div>
            <div className="mb-6">
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">Selling price</label>
              <input
                id="price"
                type="number"
                step="0.01"
                placeholder="Min 0.01 ETH"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-black"
                onChange={e => updateFormParams({ ...formParams, price: e.target.value })}
                value={formParams.price}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">Upload NFT image (jpg only)</label>
              <input
                id="image"
                type="file"
                onChange={OnChangeFile}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-black"
              />
            </div>
            <div className="text-red-500 text-center mb-4">{message}</div>
            <div>{transactionHash}</div>
            <button
              onClick={listNFT}
              className="w-full bg-black hover:bg-black text-white font-bold py-2 px-4 rounded-md shadow-md"
            >
              List NFT
            </button>
          </form>
        </div>
      </div>
      
    )
}