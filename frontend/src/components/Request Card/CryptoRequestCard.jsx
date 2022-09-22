import { useState } from 'react';
import { Button } from 'primereact/button';
import { ethers } from 'ethers'
import { networkParams } from '../../networkParams';
import { toHex } from '../../utils';
import {QRCodeCanvas} from 'qrcode.react';
import { Dialog } from 'primereact/dialog';
import {Row, Col} from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';

const CryptoRequestCard = ({request, provider, signer, address, showChat}) => {
  const [loadingTransferStatus, setLoadingTransferStatus] = useState(false)
  const [showQr, setShowQr] = useState(false)

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
  <Dialog header="Displaying QR code to request" visible={showQr} style={{ width: '30vw' }} onHide={() => {
  setShowQr(false)}}>
    <div style={{ overflow:"hidden"}}>
    <QRCodeCanvas value={`http://localhost:3000/app/request/${request._id}`} />
    </div>
    </Dialog>
    <div style={{backgroundColor: "#1f2937", margin:"30px", borderRadius:"30px", width: "100%"}}>
      <div style={{width: "100%", backgroundColor: "#141A23", height: "50px", borderRadius:"30px", borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px"}}>
      <Row><Col md={8}><h5 style={{height: "100%", paddingTop: "15px",paddingLeft: "20px", textAlign: "left"}}> <i class="pi pi-arrow-down-right"></i> Request from: <a data-tip="View on EtherScan" style={{color: "white"}} href={"https://etherscan.io/address/" + request.requestReceiver}>{request.requestReceiver}</a></h5></Col><Col md={4}><h4 style={{height: "100%", paddingTop: "10px", textAlign: "right", paddingRight: "20px"}}><small style={{fontSize:"15px"}}>Payment Due:</small> 67 ETH</h4></Col></Row>
      </div>
          <Row>
            <Col md={2}>
              <div>
                <img height="30px" width="130px" style={{margin: "10px"}} src="https://requesto.infura-ipfs.io/ipfs/QmdUCaqRiN5R6WfJBMJrAwtW7iFD9R87kqby9jeG8ZjGzj"></img>
                {/* <button style={{width: "100px", marginRight: "40px"}} class="raise"><i class="pi pi-comments"></i> Chat</button> */}
              </div>
              
            </Col>
            <Col>
              <Col md={7} style={{textAlign: "left"}}>
                <br></br>
                <h5>Request Type: Crypto token</h5>
                <p> {request.chain} network<i class="pi pi-cloud"></i></p>
                <i>Description:</i>
                <hr></hr>
                <p>{request.additional_message}</p>
                <hr></hr>
                
              </Col>
            </Col>
            <Col md={3} style={{margin: "5px"}}>
              <Row>
              <i style={{fontSize: "12px", textAlign: "right"}} data-tip={request.requestSignature}>Signature Verified <i style={{color: "green"}} class="pi pi-check"></i></i>
                <i style={{fontSize: "12px", textAlign: "right"}}> Payment Pending <i style={{color: "yellow"}} class="pi pi-clock"></i></i>
                <p style={{textAlign: "right"}}>
                  <a href="" style={{color: "white"}}>Share this Request</a>
                  <a> <i style={{fontSize: "25px", verticalAlign: "middle"}} class="pi pi-share-alt"></i> </a>
                </p>
                <button style={{width: "90%"}} class="raise"><i class="pi pi-comments"></i> Chat with user</button>
                <Row>
                  <Col md={6} style={{width: "50%"}}>
                      <button style={{margin: "5px"}} class="close">Decline <i class="pi pi-times"></i> </button>
                  </Col>
                  <Col md={6} style={{width: "50%"}}>
                  <button style={{margin: "5px"}} class="slide">Pay Now <i class="pi pi-check"></i> </button>
                  </Col>
                </Row>
              </Row>
            </Col>
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