# Requesto

## What is Requesto ?
Requesto is a web3 platform that lets you request for payments or NFTs across multiple chains. Need to request your friend for a payment or saw a cool NFT that you would like to buy? Using Requesto, you can send a request straight away to the user. 

## How does Requesto do this ?
By making use of EPNS as a communication layer, users can be notified everytime they receive a new request or if their request was fulfilled. By using EPNS, we have the ability to notify the user acorss various platforms - web, chrome extension, and mobile of an impending request so that the user can act on it immediately. 

## How does Requesto make payments easier ?
Requesto lets you request for payments in the following ways:
- Request for an amount in native currency on a particular chain (Ex: ETH, MATIC or Optimismm ETH, etc)
- Request for a amount in a particular ERC-20 token ( such as USDT, USDC, or DAI, etc) on a particular chain
- Make a request for streaming payments -> Here, you can request for a fixed amount to be paid to you across a particular time-frame (powered by Superfluid for payments)

## How does Requesto help with NFTs ?
Requesto lets you request for a particular NFT from a user. By entering the wallet address of the person they want to request a NFT from, they can request a NFT on any of the Requesto supported chains along with a message for the user. Requesto notifies the person using EPNS regarding the NFT request. 

## How does Requesto make fulfilling requests easier ?
Requesto simplifies fulfilling of requests to as minimum steps as required. Once request if fulfilled, the parties are notified. 

## How is Requesto secure ?
We realized that storing each request on-chain would be too expensive, so each request will be stored in an off-chain DB, with the request data being stored in IPFS, and signed using the sender's private key to ensure authenticity and security. 

## What else can you do with Requesto ?
- Send batch requests to multiple people at once
- ex: Split a payment between multiple addresses 

## What chains are supported by Requesto ?
Initially, we plan to support Ethereum, Polygon, and Optimism
