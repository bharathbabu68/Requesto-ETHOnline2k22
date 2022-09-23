import { useState } from 'react';
import { Button } from 'primereact/button';
import { ethers } from 'ethers'
import { networkParams } from '../../networkParams';
import { toHex } from '../../utils';
import {QRCodeCanvas} from 'qrcode.react';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import {Row, Col} from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';

const CryptoRequestCard = ({request, provider, signer, address, showChat, ReloadComponentWhenDeleted}) => {
  const [loadingTransferStatus, setLoadingTransferStatus] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [rejectRequestStatus, setRejectRequestStatus] = useState(false)
  const [TransferTextStatus, setTransferTextStatus] = useState('Confirm the transaction on your wallet')
  const [TransferSpinnerStatus, setTransferSpinnerStatus] = useState(false)

  function currency() {
    if(request.chain === "ethereum"){
      return "ETH"
    }else if(request.chain === "polygon"){
      return "MATIC"
    }
  }

  async function TransferCrypto() {
    setTransferTextStatus('Confirm the transaction on your wallet')
    setLoadingTransferStatus(true)
    setTransferSpinnerStatus(true)
    var required_chain_id;
    if(request.chain=="ethereum")
      required_chain_id = 1
    else if(request.chain=="polygon")
      required_chain_id = 80001
    const network = await provider.getNetwork()
    // check user chain matches req chain
    if(network.chainId != required_chain_id){
      setTransferTextStatus('Please follow instructions to switch to the correct network')
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
          setTransferTextStatus("You don't have the required network in your wallet. Please follow instructions to add it")
          try {
            await provider.provider.request({
              method: "wallet_addEthereumChain",
              params: [networkParams[toHex(required_chain_id)]]
            });
          } catch (err) {
            setTransferTextStatus('Error adding network to wallet')
            setTransferSpinnerStatus(false)
            console.error(err)
            return
          }
        }
        else{
          setTransferTextStatus('Error switching network')
          setTransferSpinnerStatus(false)
          console.error(switchError)
          return
        }
      }
    }try {
      const balance = await provider.getBalance(signer.getAddress())
      const balanceinEth = ethers.utils.formatEther(balance) 
      if(balanceinEth < request.amount){
        setTransferTextStatus('Insufficient balance')
        setTransferSpinnerStatus(false)
        return
      }
    }
    catch(err){
      console.error(err)
      setTransferTextStatus('Error occured')
      setTransferSpinnerStatus(false)
      return
    }
    try{
      const tx = await signer.sendTransaction({
        to: request.requestSender,
        value: ethers.utils.parseEther(request.amount)
      })
    }
    catch(err){
      console.error(err)
      setTransferTextStatus('Error: User rejected the transaction')
      setTransferSpinnerStatus(false)
      return
    }
  }


  async function RejectRequest() {
    setRejectRequestStatus(true)
    var content_to_sign = {
      "request_id": request.request_id,
      "request_sender_address": request.requestSender,
      "request_receiver_address": request.requestReceiver,
      "request_type": request.requestType,
      "request_amount": request.requestAmount,
      "request_chain": request.chain,
      "action": "rejected"
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
    var chain_val = currency()
    const response = await fetch(`http://localhost:4000/api/requests/rejectCryptoRequest`,{
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
          "amount": request.amount,
          "chain": chain_val
    })})
    if(response.status === 200){
      alert("Request rejected successfully")
      setRejectRequestStatus(false)
      ReloadComponentWhenDeleted()
    }

    

  }


  return (
    <>
  <Dialog header="Displaying QR code to request" visible={showQr} style={{ width: '30vw' }} onHide={() => {
  setShowQr(false)}}>
    <div style={{ overflow:"hidden"}}>
    <QRCodeCanvas value={`http://localhost:3000/app/request/${request._id}`} />
    </div>
    <a href={`http://localhost:3000/app/request/${request._id}`}>Payment Link</a>
    </Dialog>
    <Dialog header="Rejecting your payment Request" visible={rejectRequestStatus} style={{ width: '30vw' }} onHide={() => {
  setRejectRequestStatus(false)}}>
    <p>Please sign the message to confirm rejection of the payment request</p>
    <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/>
    </Dialog>
    <Dialog header="Processing your payment Request" visible={loadingTransferStatus} style={{ width: '30vw' }} onHide={() => {
  setLoadingTransferStatus(false)}}>
    <p>{TransferTextStatus}</p>
    {TransferSpinnerStatus && <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/>}
    </Dialog>
    <div style={{backgroundColor: "#1f2937", margin:"30px", borderRadius:"30px", width: "100%",}}>
      <div style={{width: "100%", backgroundColor: "#141A23", height: "50px", borderRadius:"30px", borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px"}}>
      {address == request.requestReceiver && <Row><Col md={8}><h5 style={{height: "100%", paddingTop: "15px",paddingLeft: "20px", textAlign: "left"}}> <i class="pi pi-arrow-down-right"></i> Payment Request from: <a data-tip="View on EtherScan" style={{color: "white", textDecoration:"none"}} href={"https://etherscan.io/address/" + request.requestSender}>{request.requestSender}</a></h5></Col><Col md={4}><h5 onClick = {()=>setShowQr(true)} style={{height: "100%", paddingTop: "10px", textAlign: "right", paddingRight: "20px", cursor:"pointer"}}> Share Request <i class="pi pi-envelope"></i> </h5></Col></Row>}
      {address != request.requestReceiver && <Row><Col md={8}><h5 style={{height: "100%", paddingTop: "15px",paddingLeft: "20px", textAlign: "left"}}> <i class="pi pi-arrow-up-right"></i> Payment Request to: <a data-tip="View on EtherScan" style={{color: "white", textDecoration:"none"}} href={"https://etherscan.io/address/" + request.requestReceiver}>{request.requestReceiver}</a></h5></Col><Col md={4}><h5 onClick = {()=>setShowQr(true)} style={{height: "100%", paddingTop: "10px", textAlign: "right", paddingRight: "20px", cursor:"pointer"}}> Share Request <i class="pi pi-envelope"></i> </h5></Col></Row>}
      </div>
          <Row>
            <Col md={2}>
              <div>
                <img height="70px" width="200px" style={{margin: "20px", borderRadius:"20px"}} src="https://requesto.infura-ipfs.io/ipfs/QmdUCaqRiN5R6WfJBMJrAwtW7iFD9R87kqby9jeG8ZjGzj"></img>
                {/* <button style={{width: "100px", marginRight: "40px"}} class="raise"><i class="pi pi-comments"></i> Chat</button> */}
              </div>
              
            </Col>
            <Col>
              <Col md={7} style={{marginLeft:"60px", textAlign: "left"}}>
                <br></br>
                <h4> Request Amount: {request.amount} {currency()}</h4>
                <hr />
                <p> Chain: {request.chain.charAt(0).toUpperCase() + request.chain.slice(1)} Testnet <i class="pi pi-cloud"></i></p>
                <p> Message from Sender : {request.additional_message} </p>
                <button style={{width: "90%", borderRadius:"30px"}} class="raise" onClick={()=>showChat(request)}><i class="pi pi-comments"></i> Chat with user</button>
         
                
              </Col>
            </Col>
            {address!=request.requestSender &&  <Col md={3} style={{margin: "5px"}}>
              <Row>
              <i style={{fontSize: "12px", textAlign: "right"}} data-tip={request.requestSignature}>Signature Verified <i style={{color: "green"}} class="pi pi-check"></i></i>
                {/* <i style={{fontSize: "12px", textAlign: "right"}}> Payment Pending <i style={{color: "yellow"}} class="pi pi-clock"></i></i> */}
                <button onClick = {()=> TransferCrypto()} style={{marginLeft: "120px", width:"50%", height:"70px", marginTop:"15px", marginBottom:"15px"}} class="slide">Pay Now <i class="pi pi-check"></i> </button>
                <button onClick = {()=>RejectRequest()} style={{marginLeft: "120px", width:"50%", height:"70px"}}  class="close">Decline <i class="pi pi-times"></i> </button>
              </Row>
            </Col>}
          </Row>
          {/* <hr></hr> */}
          <Row style={{ margin: "auto auto", textAlign: "center"}}>
            {/* <Row md={4} style={{border: "1px solid white", borderRadius: "20px", width: "100px"}}>
              <i class="pi pi-comments"></i>
              <b>Chat</b>
            </Row> */}
            {/* <img style={{height: "30px", width: "50px"}} src="https://app.epns.io/favicon.ico"></img>
            <button style={{width: "100px", marginLeft: "30px"}} class="raise"><i class="pi pi-comments"></i> Chat</button>
            <button style={{width: "100px", marginLeft: "45px"}} class="close">Decline</button>
            <button style={{width: "100px", marginLeft: "45px"}} class="slide">Pay Now</button> */}
          </Row>
          <br></br>
          {/* <p>Request ID: {request._id}</p>
          <p>Request Sender: {request.requestSender}</p>
          <p>Request Receiver: {request.requestReceiver}</p>
          <p>Request Type: {request.requestType}</p>
          <p>Chain: {request.chain}</p>
          <p>Additional Message: {request.additional_message}</p>
          <p>Request Signature: {request.requestSignature}</p>
          <p>Request Status: {request.requestStatus}</p> */}

          {/* {request.requestSender!=address && <Button label="Make Payment" onClick={async ()=>{
            await TransferCrypto(request.requestSender, request.amount, request.chain)
          }}/>}
          {request.requestSender!=address &&<Button style={{marginLeft:"30px"}} label="Reject Request" onClick={async ()=>{
            RejectRequest()
          }}/>}
          {<Button style={{marginLeft:"30px"}} label="Chat with User" onClick={async ()=>{
            showChat(request)
          }}/>}
            {<Button size="small" style={{marginLeft:"30px"}} label="Share Request" onClick={async ()=>{
              setShowQr(true)
          }}><i class="pi pi-link"></i></Button>} */}
        </div>
        <ReactTooltip />
    </>
  )
}

export default CryptoRequestCard