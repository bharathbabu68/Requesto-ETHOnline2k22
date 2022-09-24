import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import { Button } from 'primereact/button';
import CreateRequest from "../components/Request/CreateRequest"
import NotificationDetails from "../components/NotificationDetails"
import UserInbox from './Inbox/UserInbox';
import UserSent from './Sent/UserSent';
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { providerOptions } from './Web3Modal/providerOptions';
import { networkParams } from '../networkParams';
import { toHex } from '../utils'
import * as EpnsAPI from "@epnsproject/sdk-restapi";
import {QRCodeCanvas} from 'qrcode.react';

const PaymentLink = ({request_id_to_fetch}) => {

    useEffect(() => {
      if(request_id_to_fetch){
        setShowInbox(true)
        setShowNotificationDetails(false)
        setShowSent(false)
        setShowCreateRequest(false)
        setInboxButtonBorder("1px solid white")
        setSentButtonBorder("none")
        setCreateRequestButtonBorder("none")
      }
    }, [])


    const [showInbox, setShowInbox] = useState(false)
    const [showSent, setShowSent] = useState(false)
    const [showCreateRequest, setShowCreateRequest] = useState(true)
    const [showNotificationDetails, setShowNotificationDetails] = useState(false)
    const [requestId, setRequestId] = useState(false)
    const [inboxButtonBorder, setInboxButtonBorder] = useState("none")
    const [sentButtonBorder, setSentButtonBorder] = useState("none")
    const [createRequestButtonBorder, setCreateRequestButtonBorder] = useState("3px solid white")
    const [connectWalletStatus, setConnectWalletStatus] = useState("Connect Wallet")

    const [provider, setProvider] = useState()
    const [signer, setSigner] = useState()
    const [address, setAddress] = useState()

    const web3Modal = new Web3Modal({
      theme: "dark",
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions
    });

    async function connectWallet() {
      console.log("Printing props request ID: ", request_id_to_fetch)
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      console.log("Provider", provider)
      const _signer = provider.getSigner()
      const account = await _signer.getAddress()
      var account_trimmed = account.substring(0, 4) + "..." + account.substring(account.length - 4, account.length)
      var already_subscribed = true
      if(!already_subscribed){
        const subscriptions = await EpnsAPI.user.getSubscriptions({
          user: `eip155:42:${account}`, // user address in CAIP
          env: 'staging'
        });
        subscriptions.map((subscription) => {
          // console.log(subscription)
          if(subscription.channel==process.env.REACT_APP_EPNS_CHANNEL_ADDR){
            already_subscribed = true
          }
        })
      }
      if(!already_subscribed){
        const network = await provider.getNetwork()
        if(network.chainId != 42){
          var required_chain_id = 42
          if(network.chainId != required_chain_id){
            try {
              await provider.provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: toHex(required_chain_id) }]
              });
            }
            catch(switchError){
              console.error(switchError)
              // if user doesn't have the network in his wallet, let's add it to his wallet
              if (switchError.code === 4902) {
                try {
                  await provider.provider.request({
                    method: "wallet_addEthereumChain",
                    params: [networkParams[toHex(required_chain_id)]]
                  });
                } catch (err) {
                  console.error(err)
                }
              }
              else{
                console.error(switchError)
                return
              }
            }
          }
          
        }
        await EpnsAPI.channels.subscribe({
          signer: _signer,
          channelAddress: `eip155:42:${process.env.REACT_APP_EPNS_CHANNEL_ADDR}`,
          userAddress: `eip155:42:${account}`, // user address in CAIP
          onSuccess: () => {
            already_subscribed = true
            console.log('opt in success');
          },
          onError: () => {
            console.error('opt in error');
          },
          env: 'staging'
        })
      }
      if(!already_subscribed){
        alert("Please subscribe to the channel to receieve notifications. Requesto uses EPNS as a communication protocol to deliver notifications and subscription is a one time event to receive notifications. Opt-ins happen through the Kovan Testnet ")
        return
      }
      setConnectWalletStatus("Connected: " + account_trimmed)
      setProvider(provider)
      setSigner(_signer)
      setAddress(account)
      console.log("Account Connected", account)
    }

    function showDetailedNotification(requestID) {
      if(!signer){
        alert("Please Connect Wallet!")
        return;
      }
      setRequestId(requestID)
      setShowInbox(false)
      setShowNotificationDetails(true)
    }

  return (
    <>
  
    <Container id='dapp-home' fluid style={{minHeight:"1000px", overflow:"hidden"}}>
        <Row style={{padding:"1%"}}>
        <Col md={10}>
            <Row>
            <Col md={2}>
            <h3 onClick={() => window.location.href = `${process.env.REACT_APP_HOSTED_URL}/app`} style={{fontWeight:"bold", color:"white", paddingTop:"10px", color:"white", cursor:"pointer"}}>Requesto</h3>
            </Col>
            <Col md={10} style={{paddingTop:"10px", textAlign:"left"}}>
                <Row>
                <Col md={3}>
                </Col>
                </Row>
     
            </Col>

            </Row>
      </Col>
      <Col md={2} style={{paddingTop:"10px", textAlign:"right"}}>
      <Button onClick = {()=>{
        connectWallet()
      }} label={connectWalletStatus} className="p-button-rounded p-button-sm" />
      </Col>
      </Row>
      <div style={{color:"white", textAlign:"center", margin:"7%", marginTop:"1%", paddingTop:"2%", paddingBottom:"2%"}}>
        {signer && showInbox && <UserInbox provider={provider} signer={signer} request_id_to_fetch={request_id_to_fetch}/>}
        {showInbox && !signer && !request_id_to_fetch && <h3 style={{marginTop:"10%"}}>Please Connect Wallet to view Inbox</h3>}
        {showInbox && !signer && request_id_to_fetch && <h3 style={{marginTop:"10%"}}>Please Connect Wallet to view Received Request</h3>}
        {showSent && !signer && <h3 style={{marginTop:"10%"}}>Please Connect Wallet to view Sent Requests</h3>}
        {showCreateRequest && <CreateRequest provider={provider} signer={signer}/>}
        {showNotificationDetails && <NotificationDetails signer={signer} requestID={requestId} />}
      </div>
    </Container>
    </>
  )
}

export default PaymentLink