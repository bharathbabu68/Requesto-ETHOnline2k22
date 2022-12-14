import { useState, useEffect } from "react"
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Container, Row, Col } from 'react-bootstrap'
import NFTRequestCard from "../Request Card/NFTRequestCard"
import CryptoRequestCard from "../Request Card/CryptoRequestCard"
import ChatWindow from "../Chat/ChatWindow";
import { SelectButton } from 'primereact/selectbutton';

const UserSent = ({provider, signer}) => {

  const [userNftRequests, setUserNftRequests] = useState([])
  const [userCryptoRequests, setUserCryptoRequests] = useState([])
  const [showLoadingInboxDialog, setShowLoadingInboxDialog] = useState(false)
  const [currentlySelectedRequestType, setCurrentlySelectedRequestType] = useState("crypto")
  const [userAddressValue, setUserAddressValue] = useState("")
  const [activeChat, setActiveChat] = useState(null)

  const paymentTypes = [
    {name: 'Crypto Requests', value: "crypto"},
    {name: 'NFT Requests', value: "nft"},
    // {name: 'Option 3', value: 3}
  ];

  useEffect(() => {
    getAllUserRequests()
  }, [])

  // This function is called in UseEffect

  async function showChat(req){
    setActiveChat(req)
  }

  async function toggleRequestTypes(){
    if(currentlySelectedRequestType == "nft"){
      setCurrentlySelectedRequestType("crypto")
    } else {
      setCurrentlySelectedRequestType("nft")
    }
  }

  async function closeChat(){
    setActiveChat(null)
  }


  async function getAllUserRequests() {
    if(!provider || !signer){
      alert ("Please connect your wallet to receive notifications")
      return
    }
    setShowLoadingInboxDialog(true)
    const userAddress = await signer.getAddress()
    setUserAddressValue(userAddress)
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/requests/getSentRequests/${userAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    var nft_requests = []
    var crypto_requests = []
    for(var i=0; i<data.length; i++){
      if(data[i].requestType == 1){
        // this is a NFT request
        const ipfs_data = await fetch(data[i].nftData)
        const ipfs_data_json = await ipfs_data.json()
        var nft_request = {
          "_id": data[i]._id,
          "requestSender": data[i].requestSender,
          "requestReceiver": data[i].requestReceiver,
          "requestType": data[i].requestType,
          "nft_contract_address": ipfs_data_json.nft_contract_address,
          "nft_token_id": ipfs_data_json.nft_token_id,
          "chain": ipfs_data_json.chain,
          "additional_message": ipfs_data_json.additional_message,
          "token_metadata": ipfs_data_json.token_metadata,
          "requestSignature": data[i].requestSignature,
          "requestStatus": data[i].requestStatus
        }
        nft_requests.push(nft_request)
      }
      else if(data[i].requestType == 2){
        // this is a crypto request
        const ipfs_data = await fetch(data[i].paymentData)
        const ipfs_data_json = await ipfs_data.json()
        var crypto_request = {
          "_id": data[i]._id,
          "requestSender": data[i].requestSender,
          "requestReceiver": data[i].requestReceiver,
          "requestType": data[i].requestType,
          "chain": ipfs_data_json.chain,
          "amount": ipfs_data_json.amount,
          "additional_message": ipfs_data_json.additional_message,
          "requestSignature": data[i].requestSignature,
          "requestStatus": data[i].requestStatus
        }
        crypto_requests.push(crypto_request)
      }

    }
    // reverse the array to show the latest requests first
    nft_requests.reverse()
    crypto_requests.reverse()
    setUserNftRequests(nft_requests)
    setUserCryptoRequests(crypto_requests)
    console.log("Completed fetching NFT and Crypto Requests")
    console.log(nft_requests)
    console.log(crypto_requests)
    setShowLoadingInboxDialog(false)
  }

  return (
    <>
    <Container >

    <Dialog header="Loading Inbox" visible={showLoadingInboxDialog} style={{ width: '30vw' }} onHide={() => {}}>
    <p>Loading your Sent Requests. Fetching all your requests from IPFS !</p>
    <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/>
    </Dialog>


    {/* {!activeChat && <Button style={{marginRight:"68%"}} label="Toggle between crypto & NFT requests" onClick={async ()=>{
        toggleRequestTypes()
      }} />} */}

    {
      !activeChat &&
      <SelectButton style={{textAlign: "right"}} value={currentlySelectedRequestType} options={paymentTypes} onChange={(e) => setCurrentlySelectedRequestType(e.value)} optionLabel="name" />
    }


    {!showLoadingInboxDialog  && !activeChat  && currentlySelectedRequestType=="nft" && userNftRequests.length==0 && <h3 style={{fontFamily:"Raleway", marginTop:"10%"}}><br></br>No NFT Requests Sent Till Now. <br/>Create your first NFT Request in 3 Steps !</h3>}
    {!showLoadingInboxDialog  && !activeChat  && currentlySelectedRequestType=="crypto" && userCryptoRequests.length==0 && <h3 style={{fontFamily:"Raleway", marginTop:"10%"}}><br></br>No Crypto Requests Sent Till Now. <br/>Create your first Crypto Request in 3 Steps !</h3>}

    {/* render NFT requests */}
    {!showLoadingInboxDialog  && !activeChat  && currentlySelectedRequestType=="nft" && userNftRequests.length>0 && userNftRequests.map((request, index) => {
      return (
        <NFTRequestCard key={index} request={request} provider={provider} signer={signer} address={userAddressValue} showChat={showChat}/>
      )
    })}

{!showLoadingInboxDialog  && !activeChat  && currentlySelectedRequestType=="crypto" && userCryptoRequests.length>0 && userCryptoRequests.map((request, index) => {
      return (
        <CryptoRequestCard key={index} request={request} provider={provider} signer={signer} address={userAddressValue} showChat={showChat}/>
      )
    })}

{activeChat && <ChatWindow provider={provider} signer={signer} request={activeChat} closeChat={closeChat}/>}

    </Container>
    </>
  )
}

export default UserSent