import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';


const RequestStep2NFT = () => {
  const [nftResponse, setNftResponse] = useState([])
  
  useEffect(() => {
     fetch(`http://localhost:4000/api/nft/owned/0xE6D5514b8De7ef9E5F5c4cc2E8cA0207129DEB65/ethereum`,{
      method: 'GET',
      headers: {
          'Content-Type' : 'application/json'
      }
      }).then((response)=>{
          response.json()
      }).then((response)=>{
          setNftResponse(response)
      })
  }, [])

  return (
    <>
    <h2>Step 2 for NFT</h2>
    <h3>{nftResponse}</h3>
    </>
  )
}

export default RequestStep2NFT