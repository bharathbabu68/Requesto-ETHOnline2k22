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
import axios from "axios";
 

const CreateRequest = () => {
    const [receiverAddress, setReceiverAddress] = useState('');
    const [requestType, setRequestType] = useState('')
    const [step1Status, setStep1Status] = useState(false)
    const [step2Status, setStep2Status] = useState(false)
    const [step3Status, setStep3Status] = useState(false)
    
    const [fetchNFTStuff, setFetchNFTStuff] = useState(false)
    const [fetchNFTStatus, setFetchNFTStatus] = useState("Fetching NFTs from Receiver's Address")
    
    const [nftResponseEthereum, setNftResponseEthereum] = useState()
    const [nftResponsePolygon, setNftResponsePolygon] = useState()

    const fetchNFTData = async (receiverAddress, chain) => {
        const response = await fetch(`http://localhost:4000/api/nft/owned/${receiverAddress}/${chain}`,{
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json'
        }
        })
        const data = await response.json()
        return data
    }


    async function completeStep1(receiverAddress1, requestType) {
        // validate receiverAddress and requestType
        setReceiverAddress(receiverAddress1)
        setRequestType(requestType)
        var isValidAddress =  ethers.utils.isAddress(receiverAddress1)
        // check if address is a valid address
        // check if ens domain
        const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth");
        var address = await provider.resolveName(receiverAddress1);
        
        if(!isValidAddress && !address) {
            alert("Invalid Address / ENS domain")
            return
        }

        receiverAddress1 = address
        
        if(requestType=='NFT'){
            setFetchNFTStuff(true)
            var ethereum_nft_data = await fetchNFTData(receiverAddress1, 'ethereum')
            var polygon_nft_data = await fetchNFTData(receiverAddress1, 'polygon')
            if(ethereum_nft_data.length==0 && polygon_nft_data.length==0){
                setFetchNFTStatus("No NFTs found for this address")
                return
            }
            setNftResponseEthereum(ethereum_nft_data)
            setNftResponsePolygon(polygon_nft_data)
            setFetchNFTStuff(false)
        }
        setStep1Status(true)
    }

  return (
    <>
    
    <Dialog header="Fetching NFTs of your Receiver" visible={fetchNFTStuff} style={{ width: '30vw' }} onHide={() => setFetchNFTStuff(false)}>
    <p>{fetchNFTStatus}</p>
    {fetchNFTStatus!="No NFTs found for this address" && <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/>}
    </Dialog>


    <Container id="create-request" fluid style={{color:"black",border: "1px solid white", padding:"2%", width:"50%", borderRadius:"30px"}}>
        <h1>Send New Request</h1>
        <hr />
        {!step1Status  && <RequestStep1 completestep1={completeStep1}/>}

        {requestType=="NFT" && step1Status && !step2Status && <RequestStep2NFT receiver_address={receiverAddress} nftResponseEthereum={nftResponseEthereum} nftResponsePolygon={nftResponsePolygon} />}

        {requestType=="Crypto" && step1Status && !step2Status && <RequestStep2Crypto />}

    </Container>
    </>
  )
}

export default CreateRequest