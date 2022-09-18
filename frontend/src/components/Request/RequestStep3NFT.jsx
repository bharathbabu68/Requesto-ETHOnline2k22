import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';

const RequestStep3NFT = ({receiver_address, nftContractAddress, nftTokenId, chain, tokenMetadata, provider, signer}) => {
  
  const [additionalMessage, setAdditionalMessage] = useState('')

  return (
    <>
      <Container>
      <h2>Step 3</h2>
      <br />
      <h6>Confirm your NFT Request details and sign your notification</h6>
      <Row style={{textAlign:"center", margin:"2%"}}>
      <Col style={{border:"1px solid black", padding:"1%", borderRadius:"30px"}} md={12}>
      <h6>Receiver Address</h6>
      <p>{receiver_address}</p>
      <h6>Contract Address</h6>
      <p>{nftContractAddress}</p>
      <p>Token ID: {nftTokenId}</p>
      <p>Chain: {chain}</p>
      <p>Metadata: <a href={tokenMetadata}>Metadata URL</a></p>
      <p>Marketplaces Link to this NFT: <a href={`https://opensea.io/assets/${chain=="ethereum"?"ethereum":"matic"}/${nftContractAddress}/${nftTokenId}`}>Opensea</a> , <a href={`https://rarible.com/token/${chain=="polygon"?"polygon/":""}${nftContractAddress}:${nftTokenId}?tab=overview`}>Rarible</a></p>
      </Col>
      </Row>
      <br />
      <h6>Enter any additional message if any for receiver</h6>
      <InputText placeholder="Enter additional message for receiver" style={{width:"100%"}} value={additionalMessage} onChange={(e) =>       setAdditionalMessage(e.target.value)} />
      </Container>
      <br />
      <Button label="Confirm and Send" onClick={async ()=>{
        if(signer){
          const signature = await signer.signMessage(`{'receiver_address':'receiver_address','nftContractAddress':'nftContractAddress','nftTokenId':'nftTokenId','chain':'chain'}`)
          console.log(signature)
        }
        else{
          console.log("Wallet not connected ")
        }
      }} />
    </>
  )
}

export default RequestStep3NFT