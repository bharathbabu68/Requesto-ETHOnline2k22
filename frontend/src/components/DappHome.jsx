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

const DappHome = ({request_id_to_fetch}) => {

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
    const [walletProvider, setWalletProvider] = useState("")
    const [domain, setDomain] = useState("")

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
      // await localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER")
      console.log("Printing props request ID: ", request_id_to_fetch)
      const connection = await web3Modal.connect()
      // The "any" network will allow spontaneous network changes
      const provider = new ethers.providers.Web3Provider(connection, "any");
      provider.on("network", (newNetwork, oldNetwork) => {
          // When a Provider makes its initial connection, it emits a "network"
          // event with a null oldNetwork along with the newNetwork. So, if the
          // oldNetwork exists, it represents a changing network
          var new_signer = provider.getSigner()
          setProvider(provider)
          setSigner(new_signer)
          // if (oldNetwork) {
          //     window.location.reload();
          // }
      });
      console.log("Provider", provider)
      const _signer = provider.getSigner()
      const account = await _signer.getAddress()
      var account_trimmed = account.substring(0, 4) + "..." + account.substring(account.length - 4, account.length)
      var already_subscribed = false
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
      
      ////////////////////////////////////
      // UD Reverse Lookup
      // Uncomment after getting API keys
      ///////////////////////////////////

      const UDoptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${process.env.REACT_APP_UNSTOPPABLE_DOMAIN_API_KEY}`
          'Authorization': `Bearer ec3711f5-fb89-41c7-9d61-affe946688a6`
        }
      }

      var res = await fetch(`https://resolve.unstoppabledomains.com/reverse/${account}`, UDoptions)
      var data = await res.json()

      console.log(data);
      setDomain(data.meta.domain);

      if(!data.meta.domain) {
        const ensReverseLookupProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_INFURA_ETHEREUM_ENDPOINT);
        data = await ensReverseLookupProvider.lookupAddress(account);
        console.log(data);
        setDomain(data);
      }

      
      /////////////////////////////////////
      // Wallet Provider from LOCALstorage
      ////////////////////////////////////

      // var wProvider;
      // for(let i=0; i<50;i++){
      //   wProvider = localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER").replaceAll('"', '')
      // }
      // console.log(wProvider)
      // var wallet;
      // if(wProvider.localeCompare('custom-uauth'))
      //   wallet = "Unstoppable Domain Connected"
      // else if(wProvider.localeCompare('injected'))
      //   wallet = "Metamask Connected"
      // else
      //   wallet = "Wallet Connected"
      // var wallet = wProvider.localeCompare("custom-uauth") ? "Unstoppable Domain Connected" : 
      //             wProvider === "injected" ? "Metamask Connected" : "Wallet Connected";
      // console.log(wallet)
      // setWalletProvider(wallet)
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
            <Col md={3}>
            <h3 style={{fontWeight:"bold", color:"white", paddingTop:"10px", color:"white"}}>Requesto</h3>
            </Col>
            <Col md={9} style={{paddingTop:"10px", textAlign:"left"}}>
                <Row>
                <Col md={4} style={{color: "white"}}>
        <Button style={{height:"50px", width:"190px",borderRadius:"0px", border:"none", borderBottom:`${createRequestButtonBorder}`}} onClick={()=>{
                setShowInbox(false)
                setShowSent(false)
                setShowCreateRequest(true)
                setInboxButtonBorder("none")
                setSentButtonBorder("none")
                setCreateRequestButtonBorder("1px solid white")
        }} label="New Request"  className="p-button-outlined p-button-warning" />
        </Col>
                <Col md={4} style={{color: "white"}}>
            <Button style={{height:"50px", width:"150px", borderRadius:"0px",border:"none", borderBottom:`${inboxButtonBorder}`}} onClick={()=>{
                setShowInbox(true)
                setShowNotificationDetails(false)
                setShowSent(false)
                setShowCreateRequest(false)
                setInboxButtonBorder("1px solid white")
                setSentButtonBorder("none")
                setCreateRequestButtonBorder("none")
            }} label="View  Inbox"  className="p-button-warning p-button-text" />
        </Col>
        
        <Col md={4} style={{color: "white"}}>
        <Button style={{height:"50px", width:"200px", borderRadius:"0px",border:"none", borderBottom:`${sentButtonBorder}`}} onClick={()=>{
                setShowInbox(false)
                setShowSent(true)
                setShowCreateRequest(false)
                setInboxButtonBorder("none")
                setSentButtonBorder("1px solid white")
                setCreateRequestButtonBorder("none")
            }
        } label="View Sent Requests"  className="p-button-outlined p-button-warning" />
        </Col>
                </Row>
            </Col>

            </Row>
      </Col>
      <Col md={2} style={{paddingTop:"10px", textAlign:"right"}}>
        <Button onClick = {()=>{
          connectWallet()
        }} className="p-button-rounded p-button-sm">
            <Row style={{width: "170px"}}>
              <b>{domain ? domain : connectWalletStatus}</b>
              {/* <b>{connectWalletStatus}</b> */}
            </Row>
          </Button>
      </Col>
      </Row>
      <div style={{color:"white", textAlign:"center", margin:"7%", marginTop:"1%", paddingTop:"2%", paddingBottom:"2%"}}>
        {signer && showInbox && <UserInbox provider={provider} signer={signer} request_id_to_fetch={request_id_to_fetch}/>}
        {showInbox && !signer && <h3 style={{marginTop:"10%"}}>Please Connect Wallet to view Inbox</h3>}
        {signer && showSent && <UserSent provider={provider} signer={signer}/>}
        {showSent && !signer && <h3 style={{marginTop:"10%"}}>Please Connect Wallet to view Sent Requests</h3>}
        {showCreateRequest && <CreateRequest provider={provider} signer={signer}/>}
        {showNotificationDetails && <NotificationDetails signer={signer} requestID={requestId} />}
      </div>
    </Container>
    </>
  )
}

export default DappHome