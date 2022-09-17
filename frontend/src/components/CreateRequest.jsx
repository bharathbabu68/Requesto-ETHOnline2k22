import { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import RequestStep1 from './RequestStep1';
import RequestStep2NFT from './RequestStep2NFT';
import RequestStep2Crypto from './RequestStep2Crypto';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ethers } from 'ethers'
 

const CreateRequest = () => {
    const [receiverAddress, setReceiverAddress] = useState('');
    const [requestType, setRequestType] = useState('')
    const [step1Status, setStep1Status] = useState(false)
    const [step2Status, setStep2Status] = useState(false)
    const [step3Status, setStep3Status] = useState(false)
    
    const [fetchNFTStuff, setFetchNFTStuff] = useState(false)
    const [nftResponse, setNftResponse] = useState([])

    async function fetchNFTData(receiverAddress, chain) {

        await fetch(`http://localhost:4000/api/nft/owned/${receiverAddress}/${chain}`,{
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json'
        }
        }).then((response)=>{
            console.log(response)
            response.json()
        }).then((response)=>{
            setNftResponse(response)
        })
    }


    async function completeStep1(receiverAddress1, requestType) {
        // validate receiverAddress and requestType
        setReceiverAddress(receiverAddress1)
        setRequestType(requestType)
        var isValidAddress =  ethers.utils.isAddress(receiverAddress1)
        if(!isValidAddress) {
            alert("Invalid Address")
            return
        }
        if(requestType=='NFT'){
            setFetchNFTStuff(true)
            await fetchNFTData(receiverAddress1, 'ethereum')
            console.log(nftResponse)
            setFetchNFTStuff(false)
        }
        setStep1Status(true)
    }

  return (
    <>
    
    <Dialog header="Fetching NFTs of your Receiver" visible={fetchNFTStuff} style={{ width: '30vw' }} onHide={() => setFetchNFTStuff(false)}>
    <p>Fetching NFTs of {receiverAddress}, please wait !</p>
    <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/>
    </Dialog>


    <Container id="create-request" fluid style={{color:"black",border: "1px solid white", padding:"2%", width:"50%", borderRadius:"30px"}}>
        <h1>Send New Request</h1>
        <hr />
        {!step1Status  && <RequestStep1 completestep1={completeStep1}/>}

        {requestType=="NFT" && step1Status && !step2Status && <RequestStep2NFT />}

        {requestType=="Crypto" && step1Status && !step2Status && <RequestStep2Crypto />}

    </Container>
    </>
  )
}

export default CreateRequest