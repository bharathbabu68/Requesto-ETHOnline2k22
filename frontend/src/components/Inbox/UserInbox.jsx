import { useState, useEffect } from "react"
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Container, Row, Col } from 'react-bootstrap'
import NFTRequestCard from "../Request Card/NFTRequestCard"
import CryptoRequestCard from "../Request Card/CryptoRequestCard"
import ChatWindow from "../Chat/ChatWindow";

const UserInbox = ({provider, signer, request_id_to_fetch}) => {

  const [userNftRequests, setUserNftRequests] = useState([])
  const [userCryptoRequests, setUserCryptoRequests] = useState([])
  const [showLoadingInboxDialog, setShowLoadingInboxDialog] = useState(false)
  const [currentlySelectedRequestType, setCurrentlySelectedRequestType] = useState("crypto")
  const [userAddressValue, setUserAddressValue] = useState("")
  const [deleted, setDeleted] = useState(0)
  const [activeChat, setActiveChat] = useState(null)

  useEffect(() => {
    getAllUserRequests()
  }, [deleted])

  async function toggleRequestTypes(){
    if(currentlySelectedRequestType == "nft"){
      setCurrentlySelectedRequestType("crypto")
    } else {
      setCurrentlySelectedRequestType("nft")
    }
  }

  async function showChat(req){
    setActiveChat(req)
    console.log("In showchat function")
  }

  async function closeChat(){
    setActiveChat(null)
  }


  async function ReloadComponentWhenDeleted() {
    setDeleted(deleted + 1)
  }

  // This function is called in UseEffect
  async function getAllUserRequests() {
    if(!provider || !signer){
      alert ("Please connect your wallet to receive notifications")
      return
    }
    setShowLoadingInboxDialog(true)
    const userAddress = await signer.getAddress()
    setUserAddressValue(userAddress)
    const response = await fetch(`http://localhost:4000/api/requests/getReceivedRequests/${userAddress}`, {
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
    // check if nft_requests has a request with _id = request_id_to_fetch
    var found = false
    if(request_id_to_fetch){
      for(var i=0; i<nft_requests.length; i++){
        if(nft_requests[i]._id == request_id_to_fetch){
          nft_requests = [nft_requests[i]]
          // set currently selected request type to nft
          setCurrentlySelectedRequestType("nft")
          found = true
          break
        }
      }
      if(!found){
      for(var i=0; i<crypto_requests.length; i++){
        if(crypto_requests[i]._id == request_id_to_fetch){
          crypto_requests = [crypto_requests[i]]
          // set currently selected request type to crypto
          found = true
          setCurrentlySelectedRequestType("crypto")
          break
        }
      }
    }
  }
      // set currently 
    setUserNftRequests(nft_requests)
    setUserCryptoRequests(crypto_requests)
    if(request_id_to_fetch && !found){
      setUserNftRequests([])
      setUserCryptoRequests([])
    }
    console.log("Completed fetching NFT and Crypto Requests")
    console.log(nft_requests)
    console.log(crypto_requests)
    setShowLoadingInboxDialog(false)
    setUserNftRequests(nft_requests)
    setUserCryptoRequests(crypto_requests)
  }

  console.log(userCryptoRequests);
  console.log(userNftRequests);
  console.log(currentlySelectedRequestType);
  console.log(activeChat);
  console.log(showLoadingInboxDialog);
  console.log(showLoadingInboxDialog);


  return (
    <>
    <Container >
    <Dialog header="Loading Inbox" visible={showLoadingInboxDialog} style={{ width: '30vw' }} onHide={() => {}}>
    <p>Loading your Inbox. Fetching all your requests from IPFS !</p>
    <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/>
    </Dialog>

    <h3>Inbox</h3>
    <h6>Displaying your inbox of {currentlySelectedRequestType} requests</h6>
    <Button label="Toggle between crypto & NFT requests" onClick={async ()=>{
        toggleRequestTypes()
      }} />

    {!showLoadingInboxDialog && !activeChat && currentlySelectedRequestType=="nft" && userNftRequests.length==0 && <p>No NFT Requests Received Till Now</p>}
    {!showLoadingInboxDialog  && !activeChat && currentlySelectedRequestType=="crypto" && userCryptoRequests.length==0 && <p>No Crypto Requests Received Till Now</p>}

    {/* render NFT requests */}
    {!showLoadingInboxDialog  && !activeChat && currentlySelectedRequestType=="nft" && userNftRequests.length>0 && userNftRequests.map((request, index) => {
      console.log(request);
      return (
        <NFTRequestCard key={index} request={request} provider={provider} signer={signer} address={userAddressValue} ReloadComponentWhenDeleted={ReloadComponentWhenDeleted} showChat={showChat}/>
      )
    })}

{!showLoadingInboxDialog  && !activeChat &&  currentlySelectedRequestType=="crypto" && userCryptoRequests.length>0 && userCryptoRequests.map((request, index) => {
      return (
        <CryptoRequestCard key={index} request={request} provider={provider} signer={signer} address={userAddressValue} ReloadComponentWhenDeleted={ReloadComponentWhenDeleted} showChat={showChat}/>
      )
    })}

    {activeChat && <ChatWindow provider={provider} signer={signer} request={activeChat} closeChat={closeChat}/>}

    </Container>
    </>
  )
}

export default UserInbox