import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Button } from 'primereact/button';

const PageNotFound = () => {
  return (

    <Container id='home' fluid style={{height:"880px"}}>
        <Row>
        <Col md={10}>
        <h3 style={{fontWeight:"bold", color:"white", paddingTop:"10px"}}>Requesto</h3>
      </Col>
      <Col md={2} style={{paddingTop:"10px", textAlign:"right"}}>
      </Col>
      </Row>
      <div style={{textAlign:"center", marginTop:"160px"}}>
      <h1 style={{fontWeight:"bolder", color:"white", paddingTop:"10px"}}>404 Error</h1>
      <h3 style={{fontWeight:"bolder", color:"white", paddingTop:"10px"}}>Your page was not found !</h3>
      <div style={{marginTop:"50px"}}>
      <Button onClick = {()=>{
        window.location.replace("http://localhost:3000/app")
      }} label="Go to App" className="p-button-rounded p-button-sm" />
      </div>
      </div>
    </Container>

  )
}

export default PageNotFound