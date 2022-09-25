import { useState } from 'react';
import { Button } from 'primereact/button';
import { ethers } from 'ethers'
import { networkParams } from '../../networkParams';
import {QRCodeCanvas} from 'qrcode.react';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import {Row, Col} from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';

const NFTRequestCard = ({request, provider, signer, address, ReloadComponentWhenDeleted, showChat}) => {
  const [loadingTransferStatus, setLoadingTransferStatus] = useState(false)
  const [rejectRequestStatus, setRejectRequestStatus] = useState(false)
  const [showQr, setShowQr] = useState(false)

  async function TransferNFT(nft_contract_address, nft_token_id, chain) {
    setLoadingTransferStatus(true)
    // NFT transfers happen either on Ethereum Mainnet or Polygon Mainnet
    var required_chain_id;
    if(chain=="ethereum")
      required_chain_id = 5
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
      "request_receiver_address": request.requestReceiver,
      "request_type": request.requestType,
      "nft_contract_address": request.nft_contract_address,
      "nft_token_id": request.nft_token_id,
      "chain": request.chain,
      "action": "reject"
    }
    console.log(JSON.stringify(content_to_sign))
    var signature;
    try {
       signature = await signer.signMessage(JSON.stringify(content_to_sign))
    }
    catch(err){
      alert("User rejected the signature")
      setRejectRequestStatus(false)
      return
    }
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/requests/rejectNftRequest`,{
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
    <Dialog header="Rejecting your payment Request" visible={rejectRequestStatus} style={{ width: '30vw' }} onHide={() => {
  setRejectRequestStatus(false)}}>
    <p>Please sign the message to confirm rejection of the payment request</p>
    <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/>
    </Dialog>
    <Dialog header="Displaying QR code to request" visible={showQr} style={{ width: '30vw' }} onHide={() => {
  setShowQr(false)}}>
    <Row>
    <Col md={5}>
    <div style={{ overflow:"hidden"}}>
    <QRCodeCanvas value={`${process.env.REACT_APP_HOSTED_URL}/app/request/${request._id}`} />
    </div>
    </Col>
    <Col md={7}>
    <p>This payment link can only be accessed and viewed by the receiver of the request by connecting their wallet !</p>
    <a href={`${process.env.REACT_APP_HOSTED_URL}/app/request/${request._id}`}>Payment Link</a>
    </Col>
    </Row>
    </Dialog>   
        <div style={{backgroundColor: "#1f2937", margin:"30px", borderRadius:"30px", width: "100%",paddingBottom:"15px"}}>
      <div style={{width: "100%", backgroundColor: "#141A23", height: "50px", borderRadius:"30px", borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px"}}>
      {address == request.requestReceiver && <Row><Col md={8}><h5 style={{height: "100%", paddingTop: "15px",paddingLeft: "20px", textAlign: "left"}}> <i class="pi pi-arrow-down-right"></i> NFT Request from: <a data-tip="View on EtherScan" style={{color: "white", textDecoration:"none"}} href={"https://etherscan.io/address/" + request.requestSender}>{request.requestSender}</a></h5></Col><Col md={4}><h5 onClick = {()=>setShowQr(true)} style={{height: "100%", paddingTop: "10px", textAlign: "right", paddingRight: "20px", cursor:"pointer"}}> Unique Request Link <i class="pi pi-envelope"></i> </h5></Col></Row>}
      {address != request.requestReceiver && <Row><Col md={8}><h5 style={{height: "100%", paddingTop: "15px",paddingLeft: "20px", textAlign: "left"}}> <i class="pi pi-arrow-up-right"></i> NFT Request to: <a data-tip="View on EtherScan" style={{color: "white", textDecoration:"none"}} href={"https://etherscan.io/address/" + request.requestReceiver}>{request.requestReceiver}</a></h5></Col><Col md={4}><h5 onClick = {()=>setShowQr(true)} style={{height: "100%", paddingTop: "10px", textAlign: "right", paddingRight: "20px", cursor:"pointer"}}> Unique Request Link <i class="pi pi-envelope"></i> </h5></Col></Row>}
      </div>
          <Row>
            <Col md={2}>
              <div>
                <img height="120px" width="240px" style={{margin: "20px", borderRadius:"20px"}} src={request.token_metadata}></img>
              </div>
              
            </Col>
            <Col>
              <Col md={7} style={{marginLeft:"80px", textAlign: "left"}}>
                <br></br>
                <h4>Requested NFT Details</h4>
                <hr />
                <p data-tip = {request.nft_contract_address.length > 20 ? request.nft_contract_address : ""}> NFT Contract Address: {request.nft_contract_address.slice(0, 20)}{request.nft_contract_address.length>20?"..":""}</p>
                <p data-tip = {request.nft_contract_address.length > 30 ? request.nft_token_id : ""}> NFT Token ID: {request.nft_token_id.slice(0, 30)}{request.nft_token_id.length>30?"..":""}</p>
                <p> Chain: {request.chain.charAt(0).toUpperCase() + request.chain.slice(1)} Mainnet <i class="pi pi-cloud"></i></p>
                <p data-tip = {request.additional_message.length>30 ? request.additional_message:""}> Message from Sender : {request.additional_message.slice(0,30)}{request.additional_message.length > 30 ? "..":""} </p>
                <button style={{width: "90%", borderRadius:"30px"}} class="raise" onClick={()=>showChat(request)}><i class="pi pi-comments"></i> Chat with user</button>
         
                
              </Col>
            </Col>
            {address!=request.requestSender &&  <Col md={3} style={{margin: "5px"}}>
              <Row>
              <i style={{fontSize: "12px", textAlign: "right"}} data-tip={request.requestSignature}>Signature Verified <i style={{color: "green"}} class="pi pi-check"></i></i>
                <button onClick = {()=> TransferNFT(request.nft_contract_address, request.nft_token_id, request.chain)} style={{marginLeft: "120px", width:"50%", height:"70px", marginTop:"30px", marginBottom:"25px"}} class="slide"> Transfer NFT <i class="pi pi-check"></i> </button>
                <button onClick = {()=>RejectRequest()} style={{marginLeft: "120px", width:"50%", height:"70px"}}  class="close">Decline <i class="pi pi-times"></i> </button>
              </Row>
            </Col>}
          </Row>
          <ReactTooltip />
        </div>
    </>
  )
}

export default NFTRequestCard