import React from 'react'

const NFTRequestCard = ({request, provider, signer}) => {
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
        </div>
    </>
  )
}

export default NFTRequestCard