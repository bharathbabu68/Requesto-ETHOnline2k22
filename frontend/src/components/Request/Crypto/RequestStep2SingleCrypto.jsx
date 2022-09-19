import { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { ethers } from 'ethers'

const RequestStep2SingleCrypto = ({completeStep2SingleRequestCrypto}) => {
  
  const [cryptoRequestAddress, setCryptoRequestAddress] = useState('')
  const [cryptoRequestAmount, setCryptoRequestAmount] = useState('')
  const [cryptoRequestCurrency, setCryptoRequestCurrency] = useState('')
  const [loadingStatus, setLoadingStatus] = useState(false)

  async function validateCryptoRequest() {
    // check if cryptoRequestAmount is a number
    setLoadingStatus(true)
    if(isNaN(cryptoRequestAmount) || cryptoRequestAmount <= 0){
      alert("Please enter a valid amount")
      setLoadingStatus(false)
      return
    }
    // check if cryptoRequestAddress is a valid address
    var isValidAddress =  ethers.utils.isAddress(cryptoRequestAddress)
    if(!isValidAddress){
      const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_INFURA_ETHEREUM_ENDPOINT);
      var address = await provider.resolveName(cryptoRequestAddress);
        if(!address){
            alert("Invalid Address / ENS domain")
            setLoadingStatus(false)
            return
        }
        else{
          setCryptoRequestAddress(address)
          console.log("Address resolved to: ", address)
        }
    }
    setLoadingStatus(false)
    completeStep2SingleRequestCrypto(cryptoRequestCurrency, cryptoRequestAmount, address)
  }


  return (
    <>
    <h3>Step 2 - Crypto Request (Single)</h3>
    <br />
    <h6>Enter address or ENS name that you want to request crypto from</h6>
    <InputText placeholder="Enter address to request crypto from" style={{width:"100%"}} value={cryptoRequestAddress} onChange={(e) => setCryptoRequestAddress(e.target.value)} />
    <br />
    <br />
    <h6>Choose chain & crypto to request</h6>
    <RadioButton value="ethereum" onChange={(e) => {setCryptoRequestCurrency(e.value)}} checked={cryptoRequestCurrency === 'ethereum'} />
    <label style={{marginLeft:"10px", marginRight:"20px"}} > Ethereum (ETH) </label>
    <RadioButton value="polygon" onChange={(e) => {setCryptoRequestCurrency(e.value)}} checked={cryptoRequestCurrency === 'polygon'} />
    <label style={{marginLeft:"10px"}} > Polygon (MATIC) </label>
    <br />
    <br />
    <h6>Enter amount you would like to request</h6>
    <InputText placeholder="Enter Request Amount" style={{width:"50%"}} value={cryptoRequestAmount} onChange={(e) => setCryptoRequestAmount(e.target.value)} />
    <br />
    <br />
    <Button label="Confirm Details" loading={loadingStatus} onClick={async ()=>{
        if(!cryptoRequestAddress || !cryptoRequestAmount || !cryptoRequestCurrency){
            alert("Please fill all the details")
            return
        }
        else {
          validateCryptoRequest()
        }
        }}/>
    

    </>
  )
}

export default RequestStep2SingleCrypto