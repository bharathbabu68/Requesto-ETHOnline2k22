import React from 'react'
import { useEffect, useState } from 'react';
import { Client } from '@xmtp/xmtp-js'
import Spinner from 'react-bootstrap/Spinner';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import makeBlockie from 'ethereum-blockies-base64';

const ChatWindow = ({provider, signer, request, closeChat}) => {

  const [chatboxMsg, setChatMsg] = useState([]);
  const [accountAddr, setAccountAddr] = useState([]);


  // latest state variables
  const [client, setClient] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [address_chatting_with, setAddressChattingWith] = useState(null);
  const [loading, setLoader] = useState(true);
  const [showDialog, setShowDialog] = useState(true)
  const [showSpinner, setShowSpinner] = useState(true)
  const [dialogStatus, setDialogStatus] = useState("Please sign the message to create your XMTP client identity")


  useEffect( () => {
    initXMTP(signer)
  }, []);




  async function initXMTP(signer) {
    const account = await signer.getAddress()
    setAccountAddr(account)
    console.log("Account:", account)
    var xmtp;
    try {
       xmtp = await Client.create(signer)
    }
    catch (e) {
      setDialogStatus("Could not create XMTP client identity as user rejected signature request. Please try again. Reloading in 5 seconds !")
      // wait for 5 seconds in this function itself and reload the page
      await new Promise(r => setTimeout(r, 5000));
      window.location.reload();
      return
    }
    setClient(xmtp)
    const address_chatting_with = request.requestReceiver === account ? request.requestSender : request.requestReceiver
    setAddressChattingWith(address_chatting_with)
    var conversation;
    setDialogStatus("Fetching your conversation with " + address_chatting_with)
    try {
      conversation = await xmtp.conversations.newConversation(
        address_chatting_with
      )
    }
    catch (e) {
      console.log("Error: ", e)
      setDialogStatus("Your receiver has not yet created an XMTP client identity. Please try again later")
      setShowSpinner(false)
      return
    }
    setDialogStatus("Found your conversation and fetching the latest messages")
    setConversation(conversation)
    var msgs = await conversation.messages() // get all messages
    msgs = msgs.slice(-10) // get last 10 messages
    setMessages(msgs) // only show the last 10 messages
    setLoader(false)
    setShowDialog(false)
    setShowSpinner(false)
    var elem = document.getElementById('chatwindow');
    if(elem)
    elem.scrollTop = elem.scrollHeight

    for await (const message of await conversation.streamMessages()) {
      console.log(`[${message.senderAddress}]: ${message.content}`)
      // msgs.push(message)
      let M = msgs
      M.push(message)
      setMessages([...M, ])
      // console.log(msgs)
      var elem = document.getElementById('chatwindow');
      if(elem)
      elem.scrollTop = elem.scrollHeight
    }
  }

  async function sendMessage() {
    // Send a message
    var temp = document.getElementById("create-message-box");
    temp.value = "";
    await conversation.send(chatboxMsg);
    setChatMsg("")
    // messages.push(chatboxMsg);
    // setChatMsg("");
    var elem = document.getElementById('chatwindow');
    elem.scrollTop = elem.scrollHeight;

  }

  function handleChange(event) {
    // console.log(event);
    setChatMsg(event?.target?.value);
  }

  const onPressEnter = async ({ key }) => {
    if (key === "Enter") {
      await sendMessage();
      return false;
    }
  };

  return (
    <>
    <Dialog header="Loading your chat !" visible={showDialog} style={{ width: '30vw' }} onHide={() => {}}>
    <p>{dialogStatus}</p>
    {showSpinner && <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/>}
    </Dialog>
    { !loading && <div>
    <div style={{width: "70%", borderRadius: "15px", padding: "25px", margin: "auto auto"}} class="card chatbox">
      <p style={{color: "green", textAlign: "left"}}><b>Chatting with {request.requestReceiver === accountAddr ? request.requestSender : request.requestReceiver} : Powered by XMTP</b>    <Button onClick = {()=>closeChat()} style={{marginLeft:"70px"}} icon="pi pi-times" className="p-button-rounded p-button-danger" aria-label="Cancel" /></p>
      <hr style={{borderTop: "5px"}}></hr>
      <div id="chatwindow" style={{minHeight: "300px",maxHeight: "300px", overflowY: "scroll", display: "flex", flexDirection: "column-reverse"}} class="scrollbar">
          <div>
          {
            loading && (
              <Spinner animation="grow" role="status" size="xl" variant="dark">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )
          }
          {messages.map((e) => {
              return (
                <>
              {e.senderAddress==accountAddr &&<div key={e.message} style={{height: "50px", borderRadius: "30px", color: "white", 
              backgroundColor: "#304157", borderBottomRightRadius: "0px", width: "fit-content", minWidth: "50px",
              padding: "10px", paddingBottom: "0px", margin: "5px" ,marginLeft: "auto", marginRight: "20px"}}>
                <span style={{marginLeft:"10px", marginRight:"10px",display:"flex", justifyContent:"center", alignItems:"center"}} >
                {e.message || e.content}
                <Avatar style={{marginLeft:"20px"}} image = {makeBlockie(accountAddr)} className="mr-2" shape="circle" />
                </span>
             </div> }


              {e.senderAddress!=accountAddr && <div key={e.message} style={{height: "50px", borderRadius: "30px", color: "white", 
              backgroundColor: "#783f8f", borderBottomLeftRadius: "0px", width: "fit-content", minWidth: "50px",
              padding: "10px", paddingBottom: "0px", margin: "5px", marginLeft: "20px"}}>
                <span style={{marginLeft:"10px", marginRight:"10px",display:"flex", justifyContent:"center", alignItems:"center"}} >
                <Avatar style={{marginRight:"10px"}} image = {makeBlockie(address_chatting_with)} className="mr-2" shape="circle" />
                {e.message || e.content}
                </span> 
              </div>}
              
              </>
              )
              })} 
          </div>
      </div>
      <div style={{marginTop:"1%", borderRadius:"30px"}} class="textarea-container">
        <textarea onChange={handleChange} id="create-message-box" onKeyUp={onPressEnter} onBlur={handleChange} style={{width: "100%", height: "35px"}} placeholder="Start typing here..."></textarea>
        <i onClick={sendMessage} class="chat-icon pi pi-send" style={{color: "blue", fontSize: "22px", cursor:"pointer"}}></i>
      </div>

    </div>
    </div>}
    </>
  )
}

export default ChatWindow