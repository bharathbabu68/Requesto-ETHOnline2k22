import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';

import { create as ipfsHttpClient } from 'ipfs-http-client'

const RequestStep3SingleCrypto = ({cryptoReqReceiverAddress, cryptoReqChain, cryptoReqAmount, provider, signer, completeStep3}) => {

  const [showDialog, setShowDialog] = useState(false)
  const [additionalMessage, setAdditionalMessage] = useState('')
  const [showSpinner, setShowSpinner] = useState(false)
  const [dialogStatus, setDialogStatus] = useState("Please sign the message to send the request")


  const auth = 'Basic ' + Buffer.from(process.env.REACT_APP_INFURA_IPFS_PROJECT_ID + ':' + process.env.REACT_APP_INFURA_IPFS_SECRET_KEY).toString('base64')
  const client = ipfsHttpClient({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
          authorization: auth
      }
  })

  function currency() {
    if(cryptoReqChain === "ethereum"){
      return "ETH"
    }else if(cryptoReqChain === "polygon"){
      return "MATIC"
    }
  }

  async function sendCryptoRequest(){
    if(!signer && !provider){
      alert("Please connect your wallet")
      return
    }
    setShowDialog(true)
    setShowSpinner(true)
    var content_to_sign = {
      "receiver_address": cryptoReqReceiverAddress,
      "chain": cryptoReqChain,
      "amount": cryptoReqAmount,
      "additional_message": additionalMessage
    }
    console.log(JSON.stringify(content_to_sign))
    const sender_address = await signer.getAddress()
    const signature = await signer.signMessage(JSON.stringify(content_to_sign))
    console.log(signature)
    if(!signature){
      alert("Could not sign the message")
      return
    }
    setDialogStatus("Uploading your message contents to IPFS")
    const added = await client.add(JSON.stringify(content_to_sign))
    setDialogStatus("Notifying your receiver using EPNS !")
    const cid = added.path
    const data_url = (process.env.REACT_APP_IPFS_GATEWAY) + cid
    console.log(data_url)
    const response = await fetch(`http://localhost:4000/api/requests/createRequest`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "requestType":2,
          "requestSender": sender_address,
          "requestReceiver": cryptoReqReceiverAddress,
          "paymentData": data_url,
          "requestSignature": signature
    })})
    if(response.status === 200){
      console.log("Request sent successfully")
      setDialogStatus("Request sent successfully !")
      setShowSpinner(false)
      setShowDialog(false)
      completeStep3()
    }
  }

  return (
    <>
       <Dialog header="Sending crypto Request" visible={showDialog} style={{ width: '30vw' }} onHide={() => {
        setDialogStatus("Please sign the message to send the request")
        setShowSpinner(false)
        setShowDialog(false)}}>
    <p>{dialogStatus}</p>
    {showSpinner && <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/>}
    </Dialog>


    <h3>Crypto Request - Step 3</h3>
    <br />
    <h6>Confirm Details below to send your request !</h6>
    <Row style={{textAlign:"center", margin:"2%"}}>
      <Col style={{border:"1px solid black", padding:"1%", borderRadius:"30px"}} md={12}>
      <h6>Receiver Address</h6>
      <p>{cryptoReqReceiverAddress}</p>
      <h6>Chain of Request</h6>
      <p>{cryptoReqChain}</p>
      <h6>Requested Amount</h6>
      <p>{cryptoReqAmount} {currency()}</p>
      </Col>
    </Row>
    <br />
    <InputText placeholder="Enter additional message for receiver" style={{width:"100%"}} value={additionalMessage} onChange={(e) => setAdditionalMessage(e.target.value)} />
    <br />
    <br />
    <Button label="Send Request" onClick={async ()=>{
      await sendCryptoRequest()
    }}/>

    </>
  )
}

export default RequestStep3SingleCrypto