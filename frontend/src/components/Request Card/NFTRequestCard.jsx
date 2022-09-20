import React from 'react'
import { Button } from 'primereact/button';
import { ethers } from 'ethers'
import { networkParams } from '../../networkParams';
import { toHex } from '../../utils';

const NFTRequestCard = ({request, provider, signer, address}) => {

  async function TransferNFT(nft_receiver, nft_contract_address, nft_token_id, chain) {
    // NFT transfers happen either on Ethereum Mainnet or Polygon Mainnet
    var required_chain_id;
    if(chain=="ethereum")
      required_chain_id = 1
    else if(chain=="polygon")
      required_chain_id = 137
    const network = await provider.getNetwork()
    // check user chain matches req chain
    if(network.chainId != required_chain_id){
      try {
        await provider.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: toHex(required_chain_id) }]
        });
      }
      catch(switchError){
        console.error(switchError)
        // if user doesn't have the network in his wallet, let's add it to his wallet
        if (switchError.code === 4902) {
          try {
            await provider.provider.request({
              method: "wallet_addEthereumChain",
              params: [networkParams[toHex(required_chain_id)]]
            });
          } catch (err) {
            console.error(err)
          }
        }
        else{
          console.error(switchError)
          return
        }
      }
    }
    // check if user has the NFT
    // make a call to covalent API 
    const APIKEY = process.env.REACT_APP_COVALENT_API_KEY
    const baseURL = 'https://api.covalenthq.com/v1'
    const ChainId = String(required_chain_id)
    const url = new URL(`${baseURL}/${ChainId}/tokens/${nft_contract_address}/nft_metadata/${nft_token_id}/?key=${APIKEY}`);
    const response = await fetch(url);
    const result = await response.json();
    const data = result.data;
    var owner_addres_from_covalent = data.items[0].nft_data[0].owner_address
    if(owner_addres_from_covalent.toLowerCase() != address.toLowerCase()){
      alert("You dont own the NFT")
      return
    }
    const etherscan_url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${nft_contract_address}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`
    const contract_abi = await fetch(etherscan_url);
    let contract_address = nft_contract_address
    const nftContract = new ethers.Contract(contract_address, contract_abi, provider);
    console.log(nftContract)
    // const connected_nftContract =  nftContract.connect(signer);
    // await connected_nftContract.safeTransferFrom(address, nft_receiver, nft_token_id);
  }

  async function RejectRequest() {

  }


  return (
    <>
    <div style={{backgroundColor: "black", padding:"2%", margin:"30px", borderRadius:"30px"}}>
          <p>Request ID: {request._id}</p>
          <p>Request Sender: {request.requestSender}</p>
          <p>Request Receiver: {request.requestReceiver}</p>
          <p>Request Type: {request.requestType}</p>
          <p>NFT Contract Address: {request.nft_contract_address}</p>
          <p>NFT Token ID: {request.nft_token_id}</p>
          <p>Chain: {request.chain}</p>
          <p>Additional Message: {request.additional_message}</p>
          <p>Token Metadata: {request.token_metadata}</p>
          <p>Request Signature: {request.requestSignature}</p>
          <p>Request Status: {request.requestStatus}</p>
          <br />
          {request.requestSender!=address && <Button label="Transfer NFT" onClick={async ()=>{
            TransferNFT(request.requestSender, request.nft_contract_address, request.nft_token_id, request.chain)
          }}/>}
          {request.requestSender!=address && <Button style={{marginLeft:"30px"}} label="Reject Request" onClick={async ()=>{
          }}/>}
        </div>
    </>
  )
}

export default NFTRequestCard