# RARELABS
## What is rarelabs?
Rarelabs is a decentralized marketplace for NFTs. Users can connect their Sepolia Ethernet wallet to list items, purchase items, and view transaction IDs.

## Installation instructions
npm install 
npx hardhat run --networks sepolia scripts/deploy.js : To deploy the sepolia contract.

## Setting up Ethernet wallet
Install the MetaMask browser extension: https://metamask.io/
Create a new wallet or import an existing one if you have it backed up.
Navigate to the settings and add the Sepolia network using the custom RPC feature. Enter the Sepolia network details, including the RPC URL and chain ID.
Request for testnet coins from: You can use this faucet, you can mine upto 0.5 Sepolia ETH per session:
https://www.ethereum-ecosystem.com/faucets/ethereum-sepolia

## Tech Stack used:
Contract: Solidity 
Front end: React
Database storage: Pinata IPFS

# Solidity Contract Overview

The Marketplace contract is a decentralized marketplace for non-fungible tokens (NFTs) built on the Ethereum blockchain. It extends the functionality of ERC721 token standard for NFTs by inheriting from the ERC721URIStorage contract.

## State Variables
_tokenIds: A counter to keep track of the total number of tokens minted.
_itemsSold: A counter to keep track of the total number of items sold.
owner: Address of the contract owner.
listPrice: The base price set for listing an NFT.
idToListedToken: Mapping to store information about each listed token.
Events
TokenListedSuccess: Event emitted when a token is successfully listed in the marketplace.
Constructor
The constructor sets the initial owner of the contract.

## Functions
getListPrice: Returns the base listing price for NFTs.
getLatestIdToListedToken: Returns information about the latest listed token.
getListedTokenForId: Returns information about a specific listed token.
createToken: Creates a new NFT, mints it, sets its URI, and lists it for sale.
createListedToken: Creates a new listing for a token.
getAllNFTs: Returns an array of all listed tokens in the marketplace.
executeSale: Executes the sale of a listed token, transferring ownership and funds accordingly.

## Usage
Listing NFTs: Users can create and list their NFTs for sale by calling the createToken function.
Viewing NFTs: Users can view all listed NFTs in the marketplace by calling the getAllNFTs function.
Buying NFTs: Users can purchase listed NFTs by calling the executeSale function with the appropriate payment.

# Front-end components

## NavBar.js
This contains the title, Marketplace, List a new NFT option and connect the wallet option.

## MarketPlace.js 
This is basically the homepage where all the NFTs by all the users are listed.

## SellNFT.js
Once we click on the 'List a new NFT in the marketplace', it takes us to this page where the user gets to upload a new NFT.

## NFTpage.js
Once we click on an NFT, it redirects to this page where NFT details are mentioned and users can buy the NFT on this page.

# Issues
## Frontend: 
Grid layout issue.
Connect button render: Slight delay in connect button to turn from blue to green, sometimes doesn't show connected though it is connected. Need to click again for rendering.

## Storage: 
Only accepts Jpeg files and supports less than 500KB files.



# Security and Deployment
## Contract Security
Safe Token Handling: The contract uses standard OpenZeppelin libraries for ERC721 token handling, ensuring secure and reliable token operations.
Secure Transactions: Critical functions like token transfers and sales execution include appropriate access control and validation checks to prevent unauthorized actions.
Input Validation: Input parameters are validated to ensure that only valid data is processed, reducing the risk of unexpected behavior or vulnerabilities.

## Web Application Security
HTTPS: The marketplace frontend is deployed using HTTPS, ensuring encrypted communication between users and the application, mitigating the risk of data interception and tampering.
Content Security Policy (CSP): Implementing CSP headers helps mitigate the risk of XSS (Cross-Site Scripting) attacks by specifying approved sources for content, scripts, and other resources.

# References
Alchemy: https://www.youtube.com/watch?v=y6JfVdcJh1k&t=5078s 
Pinata IPFS: https://docs.pinata.cloud/ipfs-101/what-is-ipfs
Solidity contracts: https://docs.soliditylang.org/en/latest/contracts.html
