import { useState } from 'react';
import { Button } from 'primereact/button';
import { ethers } from 'ethers'
import { networkParams } from '../../networkParams';
import { toHex } from '../../utils';

const NFTRequestCard = ({request, provider, signer, address, ReloadComponentWhenDeleted, showChat}) => {
  const [loadingTransferStatus, setLoadingTransferStatus] = useState(false)
  const [rejectRequestStatus, setRejectRequestStatus] = useState(false)

  async function TransferNFT(nft_receiver, nft_contract_address, nft_token_id, chain) {
    setLoadingTransferStatus(true)
    // NFT transfers happen either on Ethereum Mainnet or Polygon Mainnet
    var required_chain_id;
    if(chain=="ethereum")
      required_chain_id = 1
    else if(chain=="polygon")
      required_chain_id = 137

    // make a call to covalent API 
    const APIKEY = process.env.REACT_APP_COVALENT_API_KEY
    const baseURL = 'https://api.covalenthq.com/v1'
    const ChainId = String(required_chain_id)
    const url = new URL(`${baseURL}/${ChainId}/tokens/${nft_contract_address}/nft_metadata/${nft_token_id}/?key=${APIKEY}`);
    const response = await fetch(url);
    const result = await response.json();
    try{
    const data = result.data
    var owner_addres_from_covalent = data.items[0].nft_data[0].owner_address
    if(owner_addres_from_covalent && owner_addres_from_covalent.toLowerCase() != address.toLowerCase()){
      alert("You dont own the NFT")
      setLoadingTransferStatus(false)
      return
    }}
    catch(err){
      console.log("NFT data not found on Covalent")
      setLoadingTransferStatus(false)
    }
    // redirect to url
    var opensea_url = `https://opensea.io/assets/${chain=="ethereum"?"ethereum":"matic"}/${nft_contract_address}/${nft_token_id}`
    window.location.href = opensea_url
  }

  async function RejectRequest() {
    setRejectRequestStatus(true)
    var content_to_sign = {
      "request_id": request.request_id,
      "request_sender_address": request.requestSender,
      "nft_contract_address": request.nft_contract_address,
      "nft_token_id": request.nft_token_id,
      "chain": request.chain,
      "action": "reject"
    }
    console.log(JSON.stringify(content_to_sign))
    const signature = await signer.signMessage(JSON.stringify(content_to_sign))
    const response = await fetch(`http://localhost:4000/api/requests/rejectNftRequest`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "requestId": request._id,
          "requestSender": request.requestSender,
          "requestReceiver": request.requestReceiver,
          "message": JSON.stringify(content_to_sign),
          "requestSignature": signature,
          "nft_contract_address": request.nft_contract_address,
          "nft_token_id": request.nft_token_id,
          "chain": request.chain,
    })})
    if(response.status === 200){
      alert("Request rejected successfully")
      setRejectRequestStatus(false)
      ReloadComponentWhenDeleted()
    }

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
          {request.requestSender!=address && <Button loading={loadingTransferStatus} label="Transfer NFT" onClick={async ()=>{
            TransferNFT(request.requestSender, request.nft_contract_address, request.nft_token_id, request.chain)
          }}/>}
          {request.requestSender!=address && <Button loading = {rejectRequestStatus} style={{marginLeft:"30px"}} label="Reject Request" onClick={async ()=>{
            RejectRequest()
          }}/>}
          {request.requestSender!=address &&<Button style={{marginLeft:"30px"}} label="Chat with User" onClick={async ()=>{
            showChat(request)
          }}/>}
        </div>
    </>
  )
}

export default NFTRequestCard