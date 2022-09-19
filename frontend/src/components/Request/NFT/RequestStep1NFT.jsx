import { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';


const RequestStep1NFT = ({completestep1}) => {
    const [receiverAddress, setReceiverAddress] = useState('');
  return (
    <>
    <h3>NFT Request - Step 1</h3>
        <br />
        <div>
        <h6>Enter Address of Receiver or ENS domain</h6>
        <InputText placeholder="Enter Receiver Address or ENS domain" style={{width:"100%"}} value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} />
        </div>
        <br />
        <br />
        <Button label="Proceed" onClick={async ()=>{
            await completestep1(receiverAddress)
        }}/>
    </>
  )
}

export default RequestStep1NFT