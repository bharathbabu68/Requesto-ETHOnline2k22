import { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';


const RequestStep1 = ({completestep1}) => {
    const [value, setValue] = useState('');
    const [requestType, setRequestType] = useState('')
  return (
    <>
    <h2>Step 1</h2>
        <br />
        <div>
        <h5>Enter Address of Receiver</h5>
        <InputText placeholder="Enter Receiver Address" style={{width:"100%"}} value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <div>
            <br />
            <br />
        <h5>Choose Request Type</h5>
        <RadioButton value="NFT" onChange={(e) => setRequestType(e.value)} checked={requestType === 'NFT'} />
        <label style={{marginLeft:"10px", marginRight:"20px"}} >NFT</label>
        <RadioButton value="Crypto" onChange={(e) => setRequestType(e.value)} checked={requestType === 'Crypto'} />
        <label style={{marginLeft:"10px"}} >Crypto</label>
        </div>
        <br />
        <br />
        <Button label="Proceed" onClick={()=>{
            completestep1(value, requestType)
        }}/>
    </>
  )
}

export default RequestStep1