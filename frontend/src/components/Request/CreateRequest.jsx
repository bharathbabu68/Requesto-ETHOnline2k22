import { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import RequestStep1 from './RequestStep1';
import RequestStep2NFT from './RequestStep2NFT';
import RequestStep2Crypto from './RequestStep2Crypto';
import RequestStep3NFT from './RequestStep3NFT';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ethers } from 'ethers'
import axios from "axios";
 

const CreateRequest = ({provider, signer}) => {
    const [receiverAddress, setReceiverAddress] = useState('');
    const [requestType, setRequestType] = useState('')
    const [step1Status, setStep1Status] = useState(false)
    const [step2Status, setStep2Status] = useState(false)
    const [step3Status, setStep3Status] = useState(false)
    
    const [fetchNFTStuff, setFetchNFTStuff] = useState(false)
    const [fetchNftLoader, setFetchNftLoader] = useState(true)
    const [fetchNFTStatus, setFetchNFTStatus] = useState("Fetching NFTs from Ethereum and Polygon")
    
    const [nftResponseEthereum, setNftResponseEthereum] = useState()
    const [nftResponsePolygon, setNftResponsePolygon] = useState()

    const [chosenNftContractAddress, setChosenNftContractAddress] = useState()
    const [chosenNftTokenId, setChosneNftTokenId] = useState()
    const [chosenChain, setChosenChain] = useState()
    const [chosenNftMetadataUrl, setChosenNftMetadataUrl] = useState()

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
        if(requestType=="NFT"){
            setFetchNFTStuff(true)
        }
        // validate receiverAddress and requestType
        setRequestType(requestType)
        var isValidAddress =  ethers.utils.isAddress(receiverAddress1)
        if(isValidAddress) {
            setReceiverAddress(receiverAddress1)
        }
        else{
            const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth");
            var address = await provider.resolveName(receiverAddress1);
            if(!address){
                setFetchNFTStatus("Invalid Address / ENS domain")
                setFetchNftLoader(false)
                return
            }
            setReceiverAddress(address)
            receiverAddress1 = address
        }

        if(requestType=='NFT'){
            var ethereum_nft_data = await fetchNFTData(receiverAddress1, 'ethereum')
            var polygon_nft_data = await fetchNFTData(receiverAddress1, 'polygon')
            if(ethereum_nft_data.length==0 && polygon_nft_data.length==0){
                setFetchNftLoader(false)
                setFetchNFTStatus("No NFTs found for this address")
                return
            }
            setNftResponseEthereum(ethereum_nft_data)
            setNftResponsePolygon(polygon_nft_data)
            setFetchNFTStuff(false)
        }
        setStep1Status(true)
    }

    async function completeStep2NFT(nftContractAddress, nftTokenId, nftChain, nftMetaDataUrl) {
        setChosenNftContractAddress(nftContractAddress)
        setChosneNftTokenId(nftTokenId)
        setChosenChain(nftChain)
        setChosenNftMetadataUrl(nftMetaDataUrl)
        setStep2Status(true)
    }

  return (
    <>
    
    <Dialog header="Fetching NFTs of your Receiver" visible={fetchNFTStuff} style={{ width: '30vw' }} onHide={() => {
        setFetchNFTStatus("Fetching NFTs from Ethereum and Polygon")
        setFetchNftLoader(true)
        setFetchNFTStuff(false)}}>
    <p>{fetchNFTStatus}</p>
    {fetchNftLoader && <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/>}
    </Dialog>
    

    <Container id="create-request" fluid style={{color:"black",border: "1px solid white", padding:"2%", width:"50%", borderRadius:"30px"}}>
        <h1>Send New Request</h1>
        <hr />
        {!step1Status  && <RequestStep1 completestep1={completeStep1}/>}

        {requestType=="NFT" && step1Status && !step2Status && <RequestStep2NFT receiver_address={receiverAddress} nftResponseEthereum={nftResponseEthereum} nftResponsePolygon={nftResponsePolygon} completeStep2NFT={completeStep2NFT}/>}

        {requestType=="Crypto" && step1Status && !step2Status && <RequestStep2Crypto />}

        {requestType=="NFT" && step1Status && step2Status && !step3Status && <RequestStep3NFT receiver_address={receiverAddress} nftContractAddress={chosenNftContractAddress} nftTokenId={chosenNftTokenId} chain = {chosenChain} tokenMetadata = {chosenNftMetadataUrl} provider={provider} signer={signer}/>}
    </Container>
    </>
  )
}

export default CreateRequest