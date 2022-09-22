import React from 'react'
import { useEffect, useState } from 'react';
import { Client } from '@xmtp/xmtp-js'

const ChatWindow = ({provider, signer, request, closeChat}) => {

  const [chatboxMsg, setChatMsg] = useState([]);
  const [accountAddr, setAccountAddr] = useState([]);


  // latest state variables
  const [client, setClient] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [address_chatting_with, setAddressChattingWith] = useState(null);


  useEffect( () => {
    initXMTP(signer)
  }, []);




  async function initXMTP(signer) {
    const account = await signer.getAddress()
    setAccountAddr(account)
    console.log("Account:", account)
    const xmtp = await Client.create(signer)
    setClient(xmtp)
    const address_chatting_with = request.requestReceiver === account ? request.requestSender : request.requestReceiver
    setAddressChattingWith(address_chatting_with)
    const conversation = await xmtp.conversations.newConversation(
      address_chatting_with
    )
    setConversation(conversation)
    const messages = await conversation.messages() // get all messages
    setMessages(messages)

    for await (const message of await conversation.streamMessages()) {
      console.log(`[${message.senderAddress}]: ${message.content}`)
      setMessages([...messages, message])
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
    <h3>Chat</h3>
    <p>Chatting with {request.requestReceiver === accountAddr ? request.requestSender : request.requestReceiver}</p>
    <div style={{width: "70%", borderRadius: "15px", padding: "25px", margin: "auto auto"}} class="card chatbox">
      {/* <br></br> */}
      <h2 style={{color: "black", textAlign: "left"}}>Chat:</h2>
      <hr style={{borderTop: "5px"}}></hr>
      <div style={{minHeight: "300px",maxHeight: "300px", overflowY: "scroll"}}>
          <div>
          {messages.map((e) => {
              return (
                <>
              {e.senderAddress==accountAddr && <div key={e.message} style={{height: "50px", borderRadius: "30px", color: "white", 
              backgroundColor: "#304157", borderBottomRightRadius: "0px", width: "fit-content", minWidth: "50px",
              padding: "10px", paddingBottom: "0px", margin: "5px" ,marginLeft:"700px"}}>
                {e.message || e.content}</div>}


              {e.senderAddress!=accountAddr && <div key={e.message} style={{height: "50px", borderRadius: "30px", color: "white", 
              backgroundColor: "#783f8f", borderBottomLeftRadius: "0px", width: "fit-content", minWidth: "50px",
              padding: "10px", paddingBottom: "0px", margin: "5px"}}>
                {e.message || e.content}</div>}
              
              </>
              )
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