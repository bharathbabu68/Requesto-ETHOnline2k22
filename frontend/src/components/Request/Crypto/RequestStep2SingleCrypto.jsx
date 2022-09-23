import { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { ethers } from 'ethers'
import { Resolution } from '@unstoppabledomains/resolution';
import ReactTooltip from 'react-tooltip';
// const {default: Resolution} = require('@unstoppabledomains/resolution');


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

    /////////////////////////////////////////
    // ENS Domains (1 ending)
    /////////////////////////////////////////
    if(cryptoRequestAddress.endsWith(".eth")){
      // check if ens domain is valid
      const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_INFURA_ETHEREUM_ENDPOINT);
      var address = await provider.resolveName(cryptoRequestAddress);
        if(!address){
            alert("Invalid ENS domain")
            setLoadingStatus(false)
            return
        }
        else{
          setCryptoRequestAddress(address)
          console.log("Address resolved to: ", address)
        }

    //////////////////////////////////////
    // Unstoppable Domains (9 endings)
    //////////////////////////////////////
    } else if(cryptoRequestAddress.endsWith(".wallet") || cryptoRequestAddress.endsWith(".crypto") ||
              cryptoRequestAddress.endsWith(".nft") || cryptoRequestAddress.endsWith(".blockchain") ||
              cryptoRequestAddress.endsWith(".x") || cryptoRequestAddress.endsWith(".bitcoin") ||
              cryptoRequestAddress.endsWith(".dao") || cryptoRequestAddress.endsWith(".888") || 
              cryptoRequestAddress.endsWith(".zil")){

        const resolution = new Resolution();
        var domain = cryptoRequestAddress;
        var currency = "ETH";
        var address;
        try{
          address = await resolution.addr(domain, currency);
          setCryptoRequestAddress(address)
          console.log("Address resolved to: ", address)
        }catch(err) {
          alert("Invalid Unstoppable domain: " + err)
          setLoadingStatus(false)
          return
        }

    }
    else{

      // check if cryptoRequestAddress is a valid address
      var isValidAddress =  ethers.utils.isAddress(cryptoRequestAddress)
      if(!isValidAddress){
        alert("Invalid Address")
        setLoadingStatus(false)
        return
      }
      address = cryptoRequestAddress
    }
    setLoadingStatus(false)
    completeStep2SingleRequestCrypto(cryptoRequestCurrency, cryptoRequestAmount, address)
  }


  return (
    <>
    <h3>Step 2 - Crypto Request (Single)</h3>
    <br />
    <h6 data-tip=".eth, .wallet, .crypto, .x, .nft etc">Enter Wallet Address / ENS / Unstoppable Domain name to request from:</h6>
    <InputText placeholder="Wallet Address / ENS / Unstoppable Domain" style={{width:"100%"}} value={cryptoRequestAddress} onChange={(e) => setCryptoRequestAddress(e.target.value)} />
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
    
    <ReactTooltip />
    </>
  )
}

export default RequestStep2SingleCrypto