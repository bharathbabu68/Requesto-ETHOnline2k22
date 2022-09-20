import { useState, useEffect } from "react"
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Container, Row, Col } from 'react-bootstrap'
import NFTRequestCard from "../Request Card/NFTRequestCard"
import CryptoRequestCard from "../Request Card/CryptoRequestCard"

const UserSent = ({provider, signer}) => {

  const [userNftRequests, setUserNftRequests] = useState([])
  const [userCryptoRequests, setUserCryptoRequests] = useState([])
  const [showLoadingInboxDialog, setShowLoadingInboxDialog] = useState(false)
  const [currentlySelectedRequestType, setCurrentlySelectedRequestType] = useState("nft")
  const [userAddressValue, setUserAddressValue] = useState("")

  useEffect(() => {
    getAllUserRequests()
  }, [])

  // This function is called in UseEffect
  async function getAllUserRequests() {
    if(!provider || !signer){
      alert ("Please connect your wallet to receive notifications")
      return
    }
    setShowLoadingInboxDialog(true)
    const userAddress = await signer.getAddress()
    setUserAddressValue(userAddress)
    const response = await fetch(`http://localhost:4000/api/requests/getSentRequests/${userAddress}`, {
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

    <h3>Sent Requests</h3>
    <h6>Displaying your sent {currentlySelectedRequestType} requests</h6>

    {!showLoadingInboxDialog && currentlySelectedRequestType=="nft" && userNftRequests.length==0 && <p>No NFT Requests Sent Till Now</p>}
    {!showLoadingInboxDialog && currentlySelectedRequestType=="crypto" && userCryptoRequests.length==0 && <p>No Crypto Requests Sent Till Now</p>}

    {/* render NFT requests */}
    {!showLoadingInboxDialog && currentlySelectedRequestType=="nft" && userNftRequests.length>0 && userNftRequests.map((request, index) => {
      return (
        <NFTRequestCard key={index} request={request} provider={provider} signer={signer} address={userAddressValue} />
      )
    })}

{!showLoadingInboxDialog && currentlySelectedRequestType=="crypto" && userNftRequests.length>0 && userCryptoRequests.map((request, index) => {
      return (
        <CryptoRequestCard key={index} request={request} provider={provider} signer={signer} address={userAddressValue} />
      )
    })}

    </Container>
    </>
  )
}

export default UserSent