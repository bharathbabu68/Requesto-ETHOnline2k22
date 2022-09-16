import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Home = () => {
  return (

    <Container id='home' fluid style={{height:"880px"}}>
      <div>
      <h3 style={{fontWeight:"bold", color:"white", paddingTop:"10px"}}>Requesto</h3>
      </div>
      <div style={{textAlign:"center", marginTop:"160px"}}>
      <h1 style={{fontWeight:"bolder", color:"white", paddingTop:"10px"}}>Your Gateway to Web3 Requests</h1>
      <Row style={{marginTop:"30px"}}>
        <Col md={4} style={{color: "white"}}>
          <div style={{border: "3px solid white", margin:"4%", height:"200px", borderRadius: "10px", padding:"5%"}}>
          <h2 style={{marginTop:"8%"}}>Request Crypto</h2>
          <p>Send Requests for Crypto or Tokens to any wallet Address across our supported chains</p>
          </div>
        </Col>
        <Col md={4} style={{color: "white"}}>
        <div style={{border: "3px solid white", margin:"4%", height:"200px", borderRadius: "10px", padding:"5%"}}>
          <h2 style={{marginTop:"8%"}}>Request NFT</h2>
          <p>Send Requests for NFTs to any wallet Address across our supported chains</p>
          </div>
        </Col>
        <Col md={4} style={{color: "white"}}>
        <div style={{border: "3px solid white", margin:"4%", height:"200px", borderRadius: "10px", padding:"5%"}}>
          <h2 style={{marginTop:"8%"}}>Easy Request Fulfilment</h2>
          <p>Received a request? Easily fulfil payment or NFT Requests in a single click!</p>
          </div>
        </Col>
      </Row>
      </div>
    </Container>

  )
}

export default Home