import { useState } from 'react'
import {Container, Row, Col, Button, Card} from 'react-bootstrap'
import ChooseRequestType from './ChooseRequestType'
import RequestProceed from './RequestProceed'


const Request = () => {

  const [requestChoice, setRequestChoice] = useState('')
  const [receiverAddress, setReceiverAddress] = useState('')

  function ProceedRequest(addr){
    // validate address inputted by end user over here and then set it
    console.log(addr)
    setReceiverAddress(addr)
  }


  return (
    <>

    <Container fluid style={{fontFamily: 'DM Sans', textAlign:"center", backgroundColor:"grey", width:"50%", marginTop:"5%", borderRadius: "30px", color:"white", padding:"3%"}}>
      <br />
      <h1>Create a new Request</h1>
      <br />
      <div style={{marginBottom: "20px"}}>

        { !requestChoice && <ChooseRequestType func={setRequestChoice}/>}

        { !receiverAddress && requestChoice === "nft" && <RequestProceed func = {ProceedRequest} inputPlaceholder = "Enter address where you wish to request NFT from" />}

        { !receiverAddress && requestChoice === "crypto" && <RequestProceed func = {ProceedRequest} inputPlaceholder = "Enter address where you wish to request payment from" />}

        

      </div>
      
    </Container> 
    </>
  )
}

export default Request