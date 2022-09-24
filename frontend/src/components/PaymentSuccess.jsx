import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Button } from 'primereact/button';

const PaymentSuccess = () => {
  return (

    <Container id='home' fluid style={{height:"880px"}}>
      <Row>
        <Col md={10}>
          <h3 style={{fontWeight:"bold", color:"white", paddingTop:"10px"}}>Requesto</h3>
        </Col>
        <Col md={2} style={{paddingTop:"10px", textAlign:"right"}}>
        </Col>
      </Row>
      <Row style={{textAlign: "center", marginTop: "100px"}}>
        <h1>Your Payment was Successful!</h1>
      </Row>
    </Container>

  )
}

export default PaymentSuccess