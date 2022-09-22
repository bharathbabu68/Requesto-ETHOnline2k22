import React from 'react'
import { useEffect, useState } from 'react';
import { Client } from '@xmtp/xmtp-js'
import Spinner from 'react-bootstrap/Spinner';

const ChatWindow = ({provider, signer, request, closeChat}) => {

  const [chatboxMsg, setChatMsg] = useState([]);
  const [accountAddr, setAccountAddr] = useState([]);


  // latest state variables
  const [client, setClient] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [address_chatting_with, setAddressChattingWith] = useState(null);
  const [loading, setLoader] = useState(true);


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
    const msgs = await conversation.messages() // get all messages
    setMessages(msgs)
    setLoader(false)
    var elem = document.getElementById('chatwindow');
    elem.scrollTop = elem.scrollHeight;

    for await (const message of await conversation.streamMessages()) {
      console.log(`[${message.senderAddress}]: ${message.content}`)
      // msgs.push(message)
      let M = msgs
      M.push(message)
      setMessages([...M])
      // console.log(msgs)
      var elem = document.getElementById('chatwindow');
      elem.scrollTop = elem.scrollHeight;
    }
  }

  async function sendMessage() {
    // Send a message
    await conversation.send(chatboxMsg);
    // messages.push(chatboxMsg);
    // setChatMsg("");
    var elem = document.getElementById('chatwindow');
    elem.scrollTop = elem.scrollHeight;

  }

  function handleChange(event) {
    // console.log(event);
    setChatMsg(event?.target?.value);
  }

  const onPressEnter = ({ key }) => {
    if (key === "Enter") {
      sendMessage();
      return false;
    }
  };

  return (
    <>
    <h3>Chat</h3>
    <p>Chatting with {request.requestReceiver === accountAddr ? request.requestSender : request.requestReceiver}</p>
    <div style={{width: "70%", borderRadius: "15px", padding: "25px", margin: "auto auto"}} class="card chatbox">
      {/* <br></br> */}
      <h2 style={{color: "black", textAlign: "left"}}>Chat:</h2>
      <hr style={{borderTop: "5px"}}></hr>
      <div id="chatwindow" style={{minHeight: "300px",maxHeight: "300px", overflowY: "scroll"}} class="scrollbar">
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
              {e.senderAddress==accountAddr && <div key={e.message} style={{height: "50px", borderRadius: "30px", color: "white", 
              backgroundColor: "#304157", borderBottomRightRadius: "0px", width: "fit-content", minWidth: "50px",
              padding: "10px", paddingBottom: "0px", margin: "5px" ,marginLeft: "auto", marginRight: "20px"}}>
                {e.message || e.content}
                <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" class="avatarS" />
              </div>}


              {e.senderAddress!=accountAddr && <div key={e.message} style={{height: "50px", borderRadius: "30px", color: "white", 
              backgroundColor: "#783f8f", borderBottomLeftRadius: "0px", width: "fit-content", minWidth: "50px",
              padding: "10px", paddingBottom: "0px", margin: "5px", marginLeft: "20px"}}>
                {e.message || e.content}
                <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="Avatar" class="avatarR" />  
              </div>}
              
              </>
              )
              })} 
          </div>
      </div>
      <div class="textarea-container">
        <textarea onKeyUp={onPressEnter} onBlur={handleChange} style={{width: "100%", height: "35px"}} placeholder="Start typing here..."></textarea>
        <i onClick={sendMessage} class="chat-icon pi pi-send" style={{color: "blue", fontSize: "22px"}}></i>
      </div>

    </div>
    </>
  )
}

export default ChatWindow