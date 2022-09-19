import { useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';

const ChooseRequestType = ({chooseRequestType}) => {
    const [requestType, setRequestType] = useState('')
  return (
    <>
    <br />
    <h2>Choose Request Type</h2>
    <br />
    <h6>Select the type of request you would like to send!</h6>
    <RadioButton value="NFT" onChange={(e) => setRequestType(e.value)} checked={requestType === 'NFT'} />
        <label style={{marginLeft:"10px", marginRight:"20px"}} >NFT</label>
        <RadioButton value="Crypto" onChange={(e) => setRequestType(e.value)} checked={requestType === 'Crypto'} />
        <label style={{marginLeft:"10px"}} >Crypto</label>
        <br />
        <br />
        <br />
        <Button label="Proceed" onClick={async ()=>{
            if(!requestType){
                alert("Please select a request type")
            }else{
            await chooseRequestType(requestType)
            }
        }}/>
    </>
  )
}

export default ChooseRequestType