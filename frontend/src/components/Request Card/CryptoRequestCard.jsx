import React from 'react'

const CryptoRequestCard = ({request, provider, signer}) => {
  return (
    <>
    <div style={{backgroundColor: "black", padding:"2%", margin:"30px", borderRadius:"30px"}}>
          <p>Request ID: {request._id}</p>
          <p>Request Sender: {request.requestSender}</p>
          <p>Request Receiver: {request.requestReceiver}</p>
          <p>Request Type: {request.requestType}</p>
          <p>Chain: {request.chain}</p>
          <p>Additional Message: {request.additional_message}</p>
          <p>Request Signature: {request.requestSignature}</p>
          <p>Request Status: {request.requestStatus}</p>
        </div>
    </>
  )
}

export default CryptoRequestCard