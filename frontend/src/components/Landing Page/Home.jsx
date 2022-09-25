import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Button } from 'primereact/button';
import DappHome from '../DappHome';
import {BrowserView, MobileView} from 'react-device-detect';

const Home = () => {
  return (
    <>
    <BrowserView>
    <Container id='home' fluid style={{height:"880px", padding: "0px !important"}}>
      <Row>
      <Col md={10}>
        <h3 style={{fontWeight:"bolder", color:"white", paddingTop:"10px", marginLeft:"10px", fontFamily:"Raleway"}}>Request<div style={{display: "inline-flex"}} class="shaking"><span>o</span></div></h3>
        {/* <div class="shaking"><span>o</span></div> */}
      </Col>
      <Col md={2} style={{paddingTop:"10px", textAlign:"right"}}>
      <Button onClick = {()=>{
        window.location.href = "/app"
      }} label="Launch App" className="p-button-rounded p-button-sm" />
      </Col>
      </Row>
      <div style={{textAlign:"center", marginTop:"160px"}}>
      <h1 className='text-effect-1' style={{fontWeight:"bolder", color:"white", paddingTop:"10px", fontSize:"60px"}}>Your Gateway to Web3 Requests</h1>
      <Row style={{marginTop:"40px", fontFamily:"Raleway"}}>
        <Col md={4} style={{color: "white"}}>
          <div className="homepage-box" style={{border: "1px solid white", margin:"4%", height:"200px", borderRadius: "10px", padding:"5%"}}>
          <h2 style={{marginTop:"8%"}}>Request Crypto</h2>
          <p>Send Requests for Crypto to any wallet Address across our supported chains</p>
          </div>
        </Col>
        <Col md={4} style={{color: "white"}}>
        <div className="homepage-box" style={{border: "1px solid white", margin:"4%", height:"200px", borderRadius: "10px", padding:"5%"}}>
          <h2 style={{marginTop:"8%"}}>Request NFT</h2>
          <p>Send Requests for NFTs to any wallet Address across our supported chains</p>
          </div>
        </Col>
        <Col md={4} style={{color: "white"}}>
        <div className="homepage-box" style={{border: "1px solid white", margin:"4%", height:"200px", borderRadius: "10px", padding:"5%"}}>
          <h2 style={{marginTop:"8%"}}>Easy Request Fulfilment</h2>
          <p>Received a request? Easily fulfil payment or NFT Requests in a single click!</p>
          </div>
        </Col>
      </Row>
      <div style={{marginTop:"200px"}}>
      </div>
      </div>
    </Container>
      <div class="stack" style={{margin: "0px !important", padding: "0px !important"}}>

      <div class="stack__card">
        <Row>
          <Col style={{textAlign:"left", padding:"2%"}} md={6}>
              <h2 style={{color:"white", fontFamily:"Raleway" , fontSize:"100px", marginRight:"50px"}}>Types of Requests</h2>
          </Col>
          <Col style={{borderLeft:"1px solid white", textAlign:"right", padding:"2%"}} md={6}>
            <h6 style={{color:"white", fontFamily:"Raleway", fontSize:"50px"}}>NFT Requests</h6>
            <p style={{color:"white", fontSize:"20px", fontFamily:"Raleway"}}>Request any wallet address for NFTs</p>
            <h6 style={{color:"white", fontFamily:"Raleway", fontSize:"50px"}}>Single Crypto Requests</h6>
            <p style={{color:"white", fontSize:"20px", fontFamily:"Raleway"}}>Request a single wallet address for crypto across our supported chains</p>
            <h6 style={{color:"white", fontFamily:"Raleway", fontSize:"50px"}}>Batch Crypto Requests</h6>
            <p style={{color:"white", fontSize:"20px", fontFamily:"Raleway"}}>Request multiple wallet addresses for crypto across our supported chains</p>

          </Col>
        </Row>
      </div>
      <div class="stack__card">
      <Row>
      <Col style={{borderRight:"1px solid white", textAlign:"left", padding:"3%"}} md={6}>
            <h6 style={{color:"white", fontFamily:"Raleway", fontSize:"50px"}}>ENS Domains</h6>
            <p style={{color:"white", fontSize:"20px", fontFamily:"Raleway"}}>Send requests any .eth domain</p>
            <h6 style={{color:"white", fontFamily:"Raleway", fontSize:"50px"}}>Unstoppable Domains</h6>
            <p style={{color:"white", fontSize:"20px", fontFamily:"Raleway"}}>Send requests to any unstoppable domain</p>
            <h6 style={{color:"white", fontFamily:"Raleway", fontSize:"50px"}}>Multi Domain Support</h6>
            <p style={{color:"white", fontSize:"20px", fontFamily:"Raleway"}}>.eth, .x, .crypto., .wallet, .888, .blockchain, .bitcoin, .dao, .nft</p>

          </Col>
          <Col style={{textAlign:"right", padding:"4%"}} md={6}>
              <h2 style={{color:"white", fontFamily:"Raleway" , fontSize:"100px", marginLeft:"50px"}}>Request using domains</h2>
          </Col>
        </Row>
        
      </div>
      <div class="stack__card">
      <Row>
          <Col style={{textAlign:"left", padding:"3%"}} md={6}>
              <h2 style={{color:"white", fontFamily:"Raleway" , fontSize:"90px", marginRight:"50px"}}>Web3 Communication</h2>
          </Col>
          <Col style={{borderLeft:"1px solid white", textAlign:"right", padding:"2%"}} md={6}>
            <h6 style={{color:"white", fontFamily:"Raleway", fontSize:"50px"}}>Notifications</h6>
            <p style={{color:"white", fontSize:"20px", fontFamily:"Raleway"}}>Receive chain & platform agnostic notifications powered by EPNS Protocol</p>
            <h6 style={{color:"white", fontFamily:"Raleway", fontSize:"50px"}}>Chat with your Requestor</h6>
            <p style={{color:"white", fontSize:"20px", fontFamily:"Raleway"}}>Chat with your requestor to clarify about your received request powered by XMTP Protocol</p>
            <h6 style={{color:"white", fontFamily:"Raleway", fontSize:"50px"}}>Share Unique Request Link</h6>
            <p style={{color:"white", fontSize:"20px", fontFamily:"Raleway"}}>Share your unique QR code or request link that can only be accessed by the receiver of your request</p>

          </Col>
        </Row>
        
      </div>
       <div class="stack__card" style={{textAlign:"center"}}>
        <div style={{padding:"2%"}}>
       <h2 style={{color:"white", fontFamily:"Raleway" , fontSize:"90px", marginRight:"50px"}}>Completely free and Secure Requests</h2>
       <p style={{color:"white", fontSize:"20px", fontFamily:"Raleway"}}>Your requests are completely free and are stored on IPFS ! All requests are signed and verified before being sent.</p>
       <p style={{color:"white", fontSize:"20px", fontFamily:"Raleway"}}> </p>
       <h4 style={{color:"white", fontFamily:"Raleway"}}>Powered by</h4>
       <Row>
        <Col md={2}>
        <img height="100px" width="220" style={{margin: "20px", borderRadius:"20px"}} src="https://mojkripto.com/wp-content/uploads/2020/07/WhatsApp-Image-2020-07-10-at-17.36.14.jpeg"></img>
        </Col>
        <Col md={2}>
        <img height="100px" width="220" style={{margin: "20px", borderRadius:"20px"}} src="https://blog.xmtp.com/content/images/2021/08/xmtp-twitter-card.png"></img>
          </Col>
          <Col md={2}>
          <img height="100px" width="220" style={{margin: "20px", borderRadius:"20px", backgroundColor:"white", padding:"1%"}} src="https://assets.website-files.com/624afb2a06eb39e29a68155b/624afb2a06eb3983eb6816b6_nftport_new_logo.svg"></img>
          </Col>
          <Col md={2}>
          <img height="100px" width="220" style={{margin: "20px", borderRadius:"20px"}} src="https://miro.medium.com/max/1400/0*n_gKYARwgB42mG6c.png"></img>
          </Col>
          <Col md={2}>
          <img height="80px" width="200" style={{margin: "20px", borderRadius:"20px", backgroundColor:"white",padding:"1%"}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/IPFS_logo.png/1200px-IPFS_logo.png"></img>
          </Col>
          <Col md={2}>
          <img height="80px" width="200" style={{margin: "20px", borderRadius:"20px", backgroundColor:"white"}} src="https://remote-europe.com/sites/default/files/2020-09/unstoppabledomains.png"></img>
          </Col>
       </Row>
       </div>
        </div>
      {/* <div class="stack__card">👌</div>  */}
    </div>
    </BrowserView>
    <MobileView>
    <Container id='home' fluid style={{height:"100%", padding: "0px !important"}}>
      <Row>
      <Col md={10}>
        <h3 style={{fontSize:"",fontWeight:"bolder", color:"white", paddingTop:"10px", marginLeft:"10px", fontFamily:"Raleway"}}>Request<div style={{display: "inline-flex"}} class="shaking"><span>o</span></div></h3>
        {/* <div class="shaking"><span>o</span></div> */}
      </Col>
      <Col md={2} style={{paddingTop:"10px", textAlign:"right"}}>
      </Col>
      </Row>
      <div style={{textAlign:"center", marginTop:"3%"}}>
      <h1 className='text-effect-1' style={{fontWeight:"bolder", color:"white", paddingTop:"10px", fontSize:"30px"}}>Your Gateway to Web3 Requests</h1>
      <Row style={{marginTop:"40px", fontFamily:"Raleway"}}>
        <Col md={4} style={{color: "white"}}>
          <div className="homepage-box" style={{border: "1px solid white", margin:"4%", height:"200px", borderRadius: "10px", padding:"5%"}}>
          <h2 style={{marginTop:"8%"}}>Request Crypto</h2>
          <p>Send Requests for Crypto to any wallet Address across our supported chains</p>
          </div>
        </Col>
        <Col md={4} style={{color: "white"}}>
        <div className="homepage-box" style={{border: "1px solid white", margin:"4%", height:"200px", borderRadius: "10px", padding:"5%"}}>
          <h2 style={{marginTop:"8%"}}>Request NFT</h2>
          <p>Send Requests for NFTs to any wallet Address across our supported chains</p>
          </div>
        </Col>
        <Col md={4} style={{color: "white"}}>
        <div className="homepage-box" style={{border: "1px solid white", margin:"4%", height:"200px", borderRadius: "10px", padding:"5%"}}>
          <h2 style={{marginTop:"8%"}}>Easy Request Fulfilment</h2>
          <p>Received a request? Easily fulfil payment or NFT Requests in a single click!</p>
          </div>
        </Col>
        <hr />
        <hr style={{color:"white"}} />
        <div style={{marginTop:"6%", marginBottom:"6%"}}>
          <p style={{color:"white", fontWeight:"bold"}}> Our app is not compatitible on mobile yet, please access this website from your desktop for now !</p>
      </div>
      </Row>
      </div>
    </Container>

    </MobileView>
    </>
  )
}

export default Home