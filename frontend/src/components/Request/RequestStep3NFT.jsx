import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Image } from 'primereact/image';
import { create as ipfsHttpClient } from 'ipfs-http-client'

const RequestStep3NFT = ({receiver_address, nftContractAddress, nftTokenId, chain, tokenMetadata, provider, signer}) => {
  
  const [additionalMessage, setAdditionalMessage] = useState('')
  const [showDialog, setShowDialog] = useState(false)
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

  async function sendNFTRequest(){
    if(!signer && !provider){
      alert("Please connect your wallet")
      return
    }
    setShowDialog(true)
    setShowSpinner(true)
    var content_to_sign = {
      "nft_contract_address": nftContractAddress,
      "nft_token_id": nftTokenId,
      "chain": chain,
      "additional_message": additionalMessage,
      "token_metadata": tokenMetadata
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
    setDialogStatus("Finishing up sending your request, hold on !")
    const cid = added.path
    const data_url = (process.env.REACT_APP_IPFS_GATEWAY) + cid
    console.log(data_url)
    // send the request to the backend
    const response = await fetch(`http://localhost:4000/api/requests/createRequest`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "requestType":1,
          "requestSender": sender_address,
          "requestReceiver": receiver_address,
          "nftData": data_url,
          "requestSignature": signature
    })})
    console.log("Printing response details")
    console.log(response)
    console.log(response.status)
    setShowDialog(false)
    console.log("Request sent")

  }

  return (
    <>
      <Dialog header="Sending NFT Request" visible={showDialog} style={{ width: '30vw' }} onHide={() => {
        setDialogStatus("Please sign the message to send the request")
        setShowSpinner(false)
        setShowDialog(false)}}>
    <p>{dialogStatus}</p>
    {showSpinner && <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/>}
    </Dialog>
      <Container>
      <h2>Step 3</h2>
      <br />
      <h6>Confirm your NFT Request details and sign your notification</h6>
      <Row style={{textAlign:"center", margin:"2%"}}>
      <Col style={{border:"1px solid black", padding:"1%", borderRadius:"30px"}} md={12}>
      <h6>Receiver Address</h6>
      <p>{receiver_address}</p>
      <h6>Contract Address</h6>
      <p>{nftContractAddress}</p>
      <p>Token ID: {nftTokenId}</p>
      <p>Chain: {chain}</p>
      <p>Metadata: <a href={tokenMetadata}>Metadata URL</a></p>
      <p>Marketplaces Link to this NFT: <a href={`https://opensea.io/assets/${chain=="ethereum"?"ethereum":"matic"}/${nftContractAddress}/${nftTokenId}`}>Opensea</a> , <a href={`https://rarible.com/token/${chain=="polygon"?"polygon/":""}${nftContractAddress}:${nftTokenId}?tab=overview`}>Rarible</a></p>
      </Col>
      </Row>
      <br />
      <h6>Enter any additional message if any for receiver</h6>
      <InputText placeholder="Enter additional message for receiver" style={{width:"100%"}} value={additionalMessage} onChange={(e) =>       setAdditionalMessage(e.target.value)} />
      </Container>
      <br />
      <Button label="Confirm and Send" onClick={async ()=>{
        sendNFTRequest()
      }} />
    </>
  )
}

export default RequestStep3NFT