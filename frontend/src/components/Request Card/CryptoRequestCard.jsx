import { useState } from 'react';
import { Button } from 'primereact/button';
import { ethers } from 'ethers'
import { networkParams } from '../../networkParams';
import { toHex } from '../../utils';

const CryptoRequestCard = ({request, provider, signer, address}) => {
  const [loadingTransferStatus, setLoadingTransferStatus] = useState(false)

  async function TransferCrypto(sender, amount, chain) {
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
          setLoadingTransferStatus(false)
          return
        }
      }
    }

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
          <p>Chain: {request.chain}</p>
          <p>Additional Message: {request.additional_message}</p>
          <p>Request Signature: {request.requestSignature}</p>
          <p>Request Status: {request.requestStatus}</p>
          {request.requestSender!=address && <Button label="Make Payment" onClick={async ()=>{
            await TransferCrypto(request.requestSender, request.amount, request.chain)
          }}/>}
          {request.requestSender!=address &&<Button style={{marginLeft:"30px"}} label="Reject Request" onClick={async ()=>{
            RejectRequest()
          }}/>}
        </div>
    </>
  )
}

export default CryptoRequestCard