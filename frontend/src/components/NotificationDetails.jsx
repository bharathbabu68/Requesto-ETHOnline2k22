import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import "../App.css";
import { Row, Col, Container, Button } from 'react-bootstrap';
import { SelectButton } from 'primereact/selectbutton';
import { Client } from '@xmtp/xmtp-js'
import { Wallet } from 'ethers'

const NotificationDetails = ({signer, requestId}) => {

  const [messages, setMessages] = useState([]);

  var xmtp;
  var conversation;

  useEffect( () => {
    initXMTP(signer);
  }, []);

  async function initXMTP(signer) {
    // const signer = provider.getSigner();
    // setSigner(signer);

    const account = signer.getAddress();
    console.log("Account:", account);
    xmtp = await Client.create(signer)
    // Create the client with your wallet. This will connect to the XMTP development network by default
    // Start a conversation with Vitalik
    conversation = await xmtp.conversations.newConversation(
      '0x90DD14cD9ce555b3059c388c7791e973BE16fbf5'
    )
    // Load all messages in the conversation
    const messages = await conversation.messages()
    // Send a message
    // await conversation.send('gm')
    // Listen for new messages in the conversation
    for await (const message of await conversation.streamMessages()) {
      console.log(`[${message.senderAddress}]: ${message.content}`)
      // messages.push();
      var msg = {
        'sender': message.senderAddress,
        'message': message.content
      }
      var msgsUptilNow = messages;
      msgsUptilNow.push(msg);
      setMessages(msgsUptilNow);
    }
  }

  async function sendMessage(msg) {
    // Send a message
    await conversation.send(msg);
  }



  return (
    <div className="flex flex-wrap align-items-center justify-content-center">

        <h1>Chat</h1>

        <Row>

          <Col md={6}></Col>
          
          <Col md={6}>

            <div style={{width: "100%", height: "100%", borderRadius: "30px"}} class="card">
              <h2 style={{color: "black"}}>Chat:</h2>
              <hr></hr>
              <div>
                {
                  messages.map((e) => {
                    console.log(e.message);
                    
                    return (<div style={{height: "80px", borderRadius: "30px", color: "black", }}>{e.message}</div>)
                    
                  })
                }
              </div>

            </div>

          </Col>

        </Row>

      {/* <div id="inbox" class="w-10 align-items-center justify-content-center">
          <TabView className="tabview-header-icon">
              <TabPanel header="Received Transactions" rightIcon="pi pi-send">
                <Card title="Advanced Card" subTitle="Subtitle" style={{ width: '25em' }} footer={footer} header={header}>
                  <p className="m-0" style={{lineHeight: '1.5'}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
                      quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!</p>
                </Card>
              </TabPanel>
              <TabPanel header="Sent Transactions" rightIcon="pi pi-check">
                  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                  architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.</p>
              </TabPanel>
          </TabView>
      </div> */}

    </div>
  )
}

export default NotificationDetails