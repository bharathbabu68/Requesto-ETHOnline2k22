import React from 'react'
import { useEffect, useState } from 'react';
import { Client } from '@xmtp/xmtp-js'

const ChatWindow = ({provider, signer, request, closeChat}) => {

  const [messages, setMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [recvMessages, setRecvMessages] = useState([]);
  const [chatboxMsg, setChatMsg] = useState([]);
  const [accountAddr, setAccountAddr] = useState([]);

  var xmtp;
  let conversation;

  useEffect( () => {
    initXMTP(signer);
  }, []);

  async function initXMTP(signer) {
    // const signer = provider.getSigner();
    // setSigner(signer);

    const account = signer.getAddress();
    account.then(v => setAccountAddr(v))
    console.log("Account:", account);
    xmtp = await Client.create(signer)
    // Create the client with your wallet. This will connect to the XMTP development network by default
    // Start a conversation with Vitalik
    conversation = await xmtp.conversations.newConversation(
      request.requestReceiver === account ? request.requestSender : request.requestReceiver
    )
    // Load all messages in the conversation
    const messages = await conversation.messages()
    // Send a message
    await conversation.send('gm')
    var sentmsgs = sentMessages
    var recvmsgs = recvMessages
    // Listen for new messages in the conversation
    for await (const message of await conversation.streamMessages()) {
      console.log(`[${message.senderAddress}]: ${message.content}`)
      // messages.push();
      var msg = {
        'sender': message.senderAddress,
        'message': message.content
      }

      if(message.senderAddress == accountAddr)
        sentmsgs.push(message);
      else if(message.senderAddress != accountAddr)
        recvmsgs.push(message);

      setSentMessages(sentmsgs);
      setRecvMessages(recvmsgs);

      var msgsUptilNow = messages;
      msgsUptilNow.push(msg);
      setMessages(msgsUptilNow);
      console.log(recvMessages);
      console.log(sentMessages);
      console.log(messages);
    }
  }

  async function sendMessage() {
    // Send a message
    await conversation.send(chatboxMsg);
  }

  function handleChange(event) {
    // console.log(event);
    setChatMsg(event?.target?.value);
  }

  return (
    <>
    <h3>Chat Window</h3>
    <p>{request.requestSender}</p>
    <div style={{width: "70%", borderRadius: "15px", padding: "25px", margin: "auto auto"}} class="card chatbox">
      {/* <br></br> */}
      <h2 style={{color: "black", textAlign: "left"}}>Chat:</h2>
      <hr style={{borderTop: "5px"}}></hr>
      <div style={{minHeight: "300px",maxHeight: "300px", overflowY: "scroll"}}>
        {
          // messages.map((e) => {
          //   console.log(e);
          //   if(!e) return;
            
            // if(e.recipientAddress == accountAddr){
            //   console.log(e.recipientAddress == accountAddr);
            //   console.log(accountAddr);
            //   return (<div key={e.message} style={{height: "50px", borderRadius: "30px", color: "white", 
            //   backgroundColor: "#304157", borderBottomLeftRadius: "0px", width: "fit-content", minWidth: "50px",
            //   padding: "10px", paddingBottom: "0px", margin: "5px"}}>{e.message || e.content}</div>)
            // }
            // else if(e.sender == accountAddr || e.senderAddress == accountAddr){
            //   console.log(accountAddr);
            //   console.log(e.sender);
            //   return (<div key={e.message} style={{height: "50px", borderRadius: "30px", color: "white", 
            //   backgroundColor: "#783f8f", borderBottomRightRadius: "0px", width: "fit-content", minWidth: "50px",
            //   padding: "10px", paddingBottom: "0px", margin: "5px", position: "absolute", right: "0 !important", top: "0 !important"}}>
            //     {e.message || e.content}</div>)
            // }
            
          // })
        }

<div>
          {sentMessages.map((e) => {
            return (<div key={e.message} style={{height: "50px", borderRadius: "30px", color: "white", 
            backgroundColor: "#304157", borderBottomRightRadius: "0px", width: "fit-content", minWidth: "50px",
            padding: "10px", paddingBottom: "0px", margin: "5px", position: "absolute", right: "0 !important", top: "0 !important"}}>
              {e.message || e.content}</div>)
          })}
        </div>
        <div>
          {recvMessages.map((e) => {
            return (<div key={e.message} style={{height: "50px", borderRadius: "30px", color: "white", 
            backgroundColor: "#783f8f", borderBottomLeftRadius: "0px", width: "fit-content", minWidth: "50px",
            padding: "10px", paddingBottom: "0px", margin: "5px"}}>
              {e.message || e.content}</div>)
          })}
        </div>
      </div>
      <div class="textarea-container">
        <textarea onChange={handleChange} style={{width: "100%", height: "35px"}} placeholder="Start typing here..."></textarea>
        <i onClick={sendMessage} class="chat-icon pi pi-send" style={{color: "blue", fontSize: "22px"}}></i>
      </div>

    </div>
    </>
  )
}

export default ChatWindow