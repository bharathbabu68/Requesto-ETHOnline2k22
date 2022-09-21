import React from 'react'

const ChatWindow = ({provider, signer, request, closeChat}) => {
  return (
    <>
    <h3>Chat Window</h3>
    <p>{request.requestSender}</p>
    </>
  )
}

export default ChatWindow