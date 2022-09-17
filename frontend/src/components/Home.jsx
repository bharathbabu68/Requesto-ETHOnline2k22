import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Button } from 'primereact/button';
import DappHome from './DappHome';

const Home = () => {
  return (

    <Container id='home' fluid style={{height:"880px"}}>
        <Row>
        <Col md={10}>
        <h3 style={{fontWeight:"bold", color:"white", paddingTop:"10px"}}>Requesto</h3>
      </Col>
      <Col md={2} style={{paddingTop:"10px", textAlign:"right"}}>
      <Button onClick = {()=>{
        window.location.href = "/app"
      }} label="Launch App" className="p-button-rounded p-button-sm" />
      </Col>
      </Row>
      <div style={{textAlign:"center", marginTop:"160px"}}>
      <h1 style={{fontWeight:"bolder", color:"white", paddingTop:"10px"}}>Your Gateway to Web3 Requests</h1>
      <Row style={{marginTop:"30px"}}>
        <Col md={4} style={{color: "white"}}>
          <div className="homepage-box" style={{border: "3px solid white", margin:"4%", height:"200px", borderRadius: "10px", padding:"5%"}}>
          <h2 style={{marginTop:"8%"}}>Request Crypto</h2>
          <p>Send Requests for Crypto or Tokens to any wallet Address across our supported chains</p>
          </div>
        </Col>
        <Col md={4} style={{color: "white"}}>
        <div className="homepage-box" style={{border: "3px solid white", margin:"4%", height:"200px", borderRadius: "10px", padding:"5%"}}>
          <h2 style={{marginTop:"8%"}}>Request NFT</h2>
          <p>Send Requests for NFTs to any wallet Address across our supported chains</p>
          </div>
        </Col>
        <Col md={4} style={{color: "white"}}>
        <div className="homepage-box" style={{border: "3px solid white", margin:"4%", height:"200px", borderRadius: "10px", padding:"5%"}}>
          <h2 style={{marginTop:"8%"}}>Easy Request Fulfilment</h2>
          <p>Received a request? Easily fulfil payment or NFT Requests in a single click!</p>
          </div>
        </Col>
      </Row>
      <div style={{marginTop:"50px"}}>
      </div>
      </div>
    </Container>

  )
}

export default Home