import { RadioButton } from 'primereact/radiobutton';
import { useState } from "react"
import { Button } from 'primereact/button';


const RequestStep1Crypto = ({completeCryptoRequestType}) => {
    const [cryptoRequestType, setCryptoRequestType] = useState('')
  return (
    <>
    <h3>Crypto Request - Step 1</h3>
    <br />
    <p>Request crypto from either a single address or split a payment to request from multiple people at the same time !</p>
    <br />
    <h6>Choose type of Request</h6>
    <RadioButton value="single" onChange={(e) => setCryptoRequestType(e.value)} checked={cryptoRequestType === 'single'} />
    <label style={{marginLeft:"10px", marginRight:"20px"}} >Single Crypto Request</label>
    <RadioButton value="split" onChange={(e) => setCryptoRequestType(e.value)} checked={cryptoRequestType === 'split'} />
    <label style={{marginLeft:"10px"}} >Batch payment Request </label>
    <br />
    <br />
    <br />
    <Button label="Confirm Details" onClick={async ()=>{
        if(!cryptoRequestType){
            alert("Please choose a crypto request type")
            return
        }
        completeCryptoRequestType(cryptoRequestType)
        }}/>

    </>
  )
}

export default RequestStep1Crypto