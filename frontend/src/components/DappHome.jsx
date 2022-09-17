import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import { Button } from 'primereact/button';
import Request from "../components/Request/Request"
import CreateRequest from './CreateRequest';

const DappHome = () => {
    const [showInbox, setShowInbox] = useState(true)
    const [showSent, setShowSent] = useState(false)
    const [showCreateRequest, setShowCreateRequest] = useState(false)
    const [inboxButtonBorder, setInboxButtonBorder] = useState("3px solid white")
    const [sentButtonBorder, setSentButtonBorder] = useState("none")
    const [createRequestButtonBorder, setCreateRequestButtonBorder] = useState("none")

  return (
    <Container id='dapp-home' fluid style={{height:"880px"}}>
        <Row style={{padding:"1%"}}>
        <Col md={10}>
            <Row>
            <Col md={3}>
            <h3 style={{fontWeight:"bold", color:"white", paddingTop:"10px"}}>Requesto</h3>
            </Col>
            <Col md={9} style={{paddingTop:"10px", textAlign:"left"}}>
                <Row>
                <Col md={4} style={{color: "white"}}>
            <Button style={{height:"50px", width:"150px", borderRadius:"0px",border:"none", borderBottom:`${inboxButtonBorder}`}} onClick={()=>{
                setShowInbox(true)
                setShowSent(false)
                setShowCreateRequest(false)
                setInboxButtonBorder("1px solid white")
                setSentButtonBorder("none")
                setCreateRequestButtonBorder("none")
            }} label="View Inbox"  className="p-button-warning p-button-text" />
        </Col>
        <Col md={4} style={{color: "white"}}>
        <Button style={{height:"50px", width:"200px", borderRadius:"0px",border:"none", borderBottom:`${sentButtonBorder}`}} onClick={()=>{
                setShowInbox(false)
                setShowSent(true)
                setShowCreateRequest(false)
                setInboxButtonBorder("none")
                setSentButtonBorder("1px solid white")
                setCreateRequestButtonBorder("none")
            }
        } label="View Sent Requests"  className="p-button-outlined p-button-warning" />
        </Col>
        <Col md={4} style={{color: "white"}}>
        <Button style={{height:"50px", width:"190px",borderRadius:"0px", border:"none", borderBottom:`${createRequestButtonBorder}`}} onClick={()=>{
                setShowInbox(false)
                setShowSent(false)
                setShowCreateRequest(true)
                setInboxButtonBorder("none")
                setSentButtonBorder("none")
                setCreateRequestButtonBorder("1px solid white")
        }} label="Send New Request"  className="p-button-outlined p-button-warning" />
        </Col>
                </Row>
            </Col>

            </Row>
      </Col>
      <Col md={2} style={{paddingTop:"10px", textAlign:"right"}}>
      <Button onClick = {()=>{
      }} label="Connect Wallet" className="p-button-rounded p-button-sm" />
      </Col>
      </Row>
      <h2 style={{textAlign:"center", marginTop:"30px", color:"white"}}>Create and Send Your Request in 3 Steps </h2>
      <div style={{color:"white", textAlign:"center", margin:"7%", marginTop:"1%", paddingTop:"2%", paddingBottom:"2%"}}>
        {showInbox && <h3 style={{}}>Inbox</h3>}
        {showSent && <h3>Sent Requests</h3>}
        {showCreateRequest && <CreateRequest />}
      </div>
    </Container>
  )
}

export default DappHome