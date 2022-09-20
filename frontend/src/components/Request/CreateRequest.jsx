import { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import ChooseRequestType from './ChooseRequestType';
import RequestStep1NFT from './NFT/RequestStep1NFT';
import RequestStep2NFT from './NFT/RequestStep2NFT';
import RequestStep3NFT from './NFT/RequestStep3NFT';

import RequestStep2SingleCrypto from './Crypto/RequestStep2SingleCrypto';
import RequestStep2BroadcastCrypto from './Crypto/RequestStep2BroadcastCrypto';
import RequestStep3SingleCrypto from './Crypto/RequestStep3SingleCrypto';
import RequestStep3BroadcastCrypto from './Crypto/RequestStep3BroadcastCrypto';

import RequestComplete from './RequestComplete';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ethers } from 'ethers'
import axios from "axios";
import { create as ipfsHttpClient } from 'ipfs-http-client'
import RequestStep1Crypto from './Crypto/RequestStep1Crypto';

 

const CreateRequest = ({provider, signer}) => {
    const [receiverAddress, setReceiverAddress] = useState('');
    const [requestType, setRequestType] = useState('')
    const [chooseRequestTypeStatus, setChooseRequestTypeStatus] = useState(false)
    const [step1NFTStatus, setStep1NFTStatus] = useState(false)
    const [step2NFTStatus, setStep2NFTStatus] = useState(false)
    const [step3NFTStatus, setStep3NFTStatus] = useState(false)

    const [step1CryptoStatus, setStep1CryptoStatus] = useState(false)
    const [cryptoRequestType, setCryptoRequestType] = useState('')
    const [step2CryptoStatus, setStep2CryptoStatus] = useState(false)
    const [step3CryptoStatus, setStep3CryptoStatus] = useState(false)
    
    const [fetchNFTStuff, setFetchNFTStuff] = useState(false)
    const [fetchNftLoader, setFetchNftLoader] = useState(true)
    const [fetchNFTStatus, setFetchNFTStatus] = useState("Fetching NFTs from Ethereum and Polygon")
    
    const [nftResponseEthereum, setNftResponseEthereum] = useState()
    const [nftResponsePolygon, setNftResponsePolygon] = useState()

    const [chosenNftContractAddress, setChosenNftContractAddress] = useState()
    const [chosenNftTokenId, setChosneNftTokenId] = useState()
    const [chosenChain, setChosenChain] = useState()
    const [chosenNftMetadataUrl, setChosenNftMetadataUrl] = useState()

    const [cryptoReqChain, setCryptoReqChain] = useState()
    const [cryptoReqAmount, setCryptoReqAmount] = useState()
    const [cryptoReqReceiverAddress, setCryptoReqReceiverAddress] = useState()


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

    async function chooseRequestType(request_type){
        setRequestType(request_type)
        setChooseRequestTypeStatus(true)
    }


    async function completeCryptoRequestType(cryptoRequestType){
        if(cryptoRequestType === "single"){
            setCryptoRequestType("single")
        }
        else{
            setCryptoRequestType("broadcast")
        }
        setStep1CryptoStatus(true)
    }

    async function completeStep2SingleRequestCrypto(crypto_req_chain, crypto_req_amount, crypto_req_addr){
        setCryptoReqChain(crypto_req_chain)
        setCryptoReqAmount(crypto_req_amount)
        setCryptoReqReceiverAddress(crypto_req_addr)
        setStep2CryptoStatus(true)
    }

    async function completeStep2BatchRequestCrypto(crypto_req_addresses, crypto_req_amount, crypto_req_chain){
        setCryptoReqChain(crypto_req_chain)
        setCryptoReqAmount(crypto_req_amount)
        setCryptoReqReceiverAddress(crypto_req_addresses)
        setStep2CryptoStatus(true)
    }


    async function completeStep1(receiverAddress1) {
        if(requestType=="NFT"){
            setFetchNFTStuff(true)
        }
        // validate receiverAddress and requestType

        if(receiverAddress1.endsWith(".eth")){
            // check if ens name is valid
            const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_INFURA_ETHEREUM_ENDPOINT);
            var address = await provider.resolveName(receiverAddress1);
            if(!address){
                setFetchNFTStatus("Invalid ENS domain")
                setFetchNftLoader(false)
                return
            }
            setReceiverAddress(address)
            receiverAddress1 = address

        }

        else{
            // check if address is valid
            var isValidAddress =  ethers.utils.isAddress(receiverAddress1)
            if(isValidAddress) {
                setReceiverAddress(receiverAddress1)
            }
            else{
                setFetchNFTStatus("Invalid Ethereum address")
                setFetchNftLoader(false)
                return
            }

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
        setStep1NFTStatus(true)
    }

    async function completeStep2NFT(nftContractAddress, nftTokenId, nftChain, nftMetaDataUrl) {
        setChosenNftContractAddress(nftContractAddress)
        setChosneNftTokenId(nftTokenId)
        setChosenChain(nftChain)
        setChosenNftMetadataUrl(nftMetaDataUrl)
        setStep2NFTStatus(true)
    }

    async function completeStep3(){
        setStep3NFTStatus(true)
    }

    async function completeStep3Crypto(){
        setStep3CryptoStatus(true)
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

    <h2 style={{textAlign:"center", marginTop:"30px", color:"white", fontWeight:"light"}}>Create and Send Your Request in 3 Steps !</h2>
    <br></br>

    

    <Container id="create-request" fluid style={{color:"black",border: "1px solid white", padding:"2%", width:"50%", borderRadius:"30px"}}>


        {!chooseRequestTypeStatus && <ChooseRequestType chooseRequestType={chooseRequestType} />}

        {requestType=="NFT" && chooseRequestTypeStatus && !step1NFTStatus  && <RequestStep1NFT completestep1={completeStep1}/>}

        {requestType=="Crypto" && chooseRequestTypeStatus && !step1CryptoStatus  && <RequestStep1Crypto completeCryptoRequestType={completeCryptoRequestType}/>}

        {requestType=="Crypto" && chooseRequestTypeStatus && step1CryptoStatus && !step2CryptoStatus && cryptoRequestType=="single"  && <RequestStep2SingleCrypto completeStep2SingleRequestCrypto={completeStep2SingleRequestCrypto}/>}
        {requestType=="Crypto" && chooseRequestTypeStatus && step1CryptoStatus && step2CryptoStatus && !step3CryptoStatus && cryptoRequestType=="single"  && <RequestStep3SingleCrypto cryptoReqReceiverAddress={cryptoReqReceiverAddress} cryptoReqChain={cryptoReqChain} cryptoReqAmount={cryptoReqAmount} provider={provider} signer = {signer} completeStep3={completeStep3Crypto}/>}
        
        {requestType=="Crypto" && chooseRequestTypeStatus && step1CryptoStatus && !step2CryptoStatus && !step3CryptoStatus && cryptoRequestType=="broadcast"  && <RequestStep2BroadcastCrypto completeStep2BatchRequestCrypto={completeStep2BatchRequestCrypto}/>}

        {requestType=="Crypto" && chooseRequestTypeStatus && step1CryptoStatus && step2CryptoStatus && !step3CryptoStatus && cryptoRequestType=="broadcast"  && <RequestStep3BroadcastCrypto cryptoReqReceiverAddress={cryptoReqReceiverAddress} cryptoReqChain={cryptoReqChain} cryptoReqAmount={cryptoReqAmount} provider={provider} signer = {signer} completeStep3={completeStep3Crypto}/>}
        
        {requestType=="NFT" && chooseRequestTypeStatus && step1NFTStatus && !step2NFTStatus && <RequestStep2NFT receiver_address={receiverAddress} nftResponseEthereum={nftResponseEthereum} nftResponsePolygon={nftResponsePolygon} completeStep2NFT={completeStep2NFT}/>}


        {requestType=="NFT" && chooseRequestTypeStatus && step1NFTStatus && step2NFTStatus && !step3NFTStatus && <RequestStep3NFT receiver_address={receiverAddress} nftContractAddress={chosenNftContractAddress} nftTokenId={chosenNftTokenId} chain = {chosenChain} tokenMetadata = {chosenNftMetadataUrl} provider={provider} signer={signer} completeStep3={completeStep3}/>}
    
        {chooseRequestTypeStatus && step1NFTStatus && step2NFTStatus && step3NFTStatus && <RequestComplete />}

        {chooseRequestTypeStatus && step1CryptoStatus && step2CryptoStatus && step3CryptoStatus && <RequestComplete />}
    
    </Container>
    </>
  )
}

export default CreateRequest