import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { ethers } from 'ethers'
import { Dialog } from 'primereact/dialog';
import { Image } from 'primereact/image';


const RequestStep2NFT = ({nftResponseEthereum, nftResponsePolygon, receiver_address, completeStep2NFT}) => {

  const [nftContractAddress, setNftContractAddress] = useState('')
  const [nftTokenId, setNftTokenId] = useState('')
  const [chain, setChain] = useState('')
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [fetchedNftDetails, setFetchedNftDetails] = useState()
  const [imageMetaData, setImageMetaData] = useState()

  async function fetchNFTDetails(){
    const response = await fetch(`http://localhost:4000/api/nft/details/${nftContractAddress}/${nftTokenId}/${chain}`,{
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json'
        }
        })
    const data = await response.json()
    return data
  }

  async function verifyDetails(){
    // verify if the entered address is a valid contract address
    var isValidAddress =  ethers.utils.isAddress(nftContractAddress)
    if(!isValidAddress){
      alert("Invalid Contract Address")
      return
    }
    // verify if the entered token id is a valid by checking if its a number

    console.log(nftContractAddress, nftTokenId, chain)

    var nftDetails = await fetchNFTDetails()

    setFetchedNftDetails(nftDetails)

    // console.log(nftDetails)

    if(nftDetails.response=="OK"){
      console.log(nftDetails.owner)
      console.log(receiver_address)
      if(nftDetails.owner.toLowerCase() !=receiver_address.toLowerCase() ){
        if(nftDetails.owner == "0x0000000000000000000000000000000000000000"){
          alert("Could not fetch owner details. Please verify that your receiver owns this NFT !")
        }
        else{
          alert("The NFT is not owned by the receiver address")
          return
        }
      }
      // alert("NFT Details verified and owned by the owner")
      setImageMetaData(nftDetails.metadata_url)
      setShowConfirmationModal(true)
    }
    else{
      alert(nftDetails["error"].message)
    }
    
  }

  return (
    <>

    <Dialog header="Confirm NFT Request" visible={showConfirmationModal} style={{ width: '45vw' }} onHide={() => setShowConfirmationModal(false)}>
    <Row>
      <Col md={9}>
    <h6>Please confirm the NFT you wish to request for</h6>
    <p>Contract Address: {nftContractAddress}</p>
    <p>Token ID: {nftTokenId}</p>
    <p>Chain: {chain}</p>
    <p>Marketplaces Link to this NFT: <a href={`https://opensea.io/assets/${chain=="ethereum"?"ethereum":"matic"}/${nftContractAddress}/${nftTokenId}`}>Opensea</a> , <a href={`https://rarible.com/token/${chain=="polygon"?"polygon/":""}${nftContractAddress}:${nftTokenId}?tab=overview`}>Rarible</a></p>
    </Col>
    <Col md={3}>
    <a href={imageMetaData}><h6>NFT Metadata</h6></a>
    <Image width="140" src={imageMetaData} alt="Image Text" />
    </Col>
    </Row>
    <Row style={{textAlign:"center", marginLeft:"4%"}}>
    <Col md={12}>
    <Button label="Confirm and Proceed" onClick={() => completeStep2NFT(nftContractAddress, nftTokenId, chain, imageMetaData)} />
    </Col>
    </Row>
    </Dialog>



    <h2>Step 2</h2>
    <p>Your Receiver owns {nftResponseEthereum.length==50 ? "more than 50" : nftResponseEthereum.length} NFTs on <a href={`https://etherscan.io/address/${receiver_address}`}>Ethereum</a>, {nftResponsePolygon.length==50 ? "more than 50": nftResponsePolygon.length} NFTs on <a href={`https://polygonscan.com/address/${receiver_address}`}>Polygon</a></p>
    <br />
    <h6>Choose Chain where you wish to request the NFT from</h6>
    <RadioButton value="ethereum" onChange={(e) => setChain(e.value)} checked={chain === 'ethereum'} />
    <label style={{marginLeft:"10px", marginRight:"20px"}} >Ethereum</label>
    <RadioButton value="polygon" onChange={(e) => setChain(e.value)} checked={chain === 'polygon'} />
    <label style={{marginLeft:"10px"}} >Polygon</label>
    <br />
    <br />
    <div>
    <h6>Enter NFT Contract Address</h6>
    <InputText placeholder="Enter Contract Address of NFT you would like to Request" style={{width:"100%"}} value={nftContractAddress} onChange={(e) => setNftContractAddress(e.target.value)} />
    </div>
    <div>
      <br />
    <h6>Enter NFT Token ID</h6>
    <InputText placeholder="Enter token ID of NFT you would like to Request" style={{width:"100%"}} value={nftTokenId} onChange={(e) => setNftTokenId(e.target.value)} />
    </div>
    <br />
    <Button label="Confirm Details" onClick={async ()=>{
      await verifyDetails()
        }}/>
    </>
  )
}

export default RequestStep2NFT