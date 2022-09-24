import { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { ethers } from 'ethers'
import { Resolution } from '@unstoppabledomains/resolution';

const RequestStep2BroadcastCrypto = ({completeStep2BatchRequestCrypto}) => {
  const [cryptoRequestAddresses, setCryptoRequestAddresses] = useState('')
  const [cryptoRequestAmount, setCryptoRequestAmount] = useState('')
  const [cryptoRequestCurrency, setCryptoRequestCurrency] = useState('')
  const [loadingStatus, setLoadingStatus] = useState(false)

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  async function validateBatchCryptoRequest() {

    var cryptoAddresses = cryptoRequestAddresses.split(",")
    var initial_len = cryptoAddresses.length
    if(cryptoAddresses.length < 2){
      alert("Please enter at least 2 addresses")
      setLoadingStatus(false)
      return
    }
    // check if cryptoRequestAmount is a number
    setLoadingStatus(true)
    if(isNaN(cryptoRequestAmount) || cryptoRequestAmount <= 0){
      alert("Please enter a valid amount")
      setLoadingStatus(false)
      return
    }
    // check if cryptoRequestAddress is a valid address
    for (var i = 0; i < cryptoAddresses.length; i++) {
      cryptoAddresses[i] = cryptoAddresses[i].trim()  
      // check if cryptoAddresses[i] ends with .eth
      if(cryptoAddresses[i].endsWith(".eth")){
          const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_INFURA_ETHEREUM_ENDPOINT);
          var address = await provider.resolveName(cryptoAddresses[i]);
          if(!address){
            alert("Invalid ENS domain on index " + String(i) +  " for " + cryptoAddresses[i])
            setLoadingStatus(false)
            return
          }
          else{
            cryptoAddresses[i] = address
            console.log("Address resolved to: ", address)
          }
      }
      else if(cryptoAddresses[i].endsWith(".wallet") || cryptoAddresses[i].endsWith(".crypto") ||
              cryptoAddresses[i].endsWith(".nft") || cryptoAddresses[i].endsWith(".blockchain") ||
              cryptoAddresses[i].endsWith(".x") || cryptoAddresses[i].endsWith(".bitcoin") ||
              cryptoAddresses[i].endsWith(".dao") || cryptoAddresses[i].endsWith(".888") || 
              cryptoAddresses[i].endsWith(".zil")){

        const resolution = new Resolution();
        var domain = cryptoAddresses[i];
        var currency = "ETH";
        var address;
        try{
          address = await resolution.addr(domain, currency);
          cryptoAddresses[i] = address;
          console.log("Address resolved to: ", address)
        }catch(err) {
          alert("Invalid Unstoppable domain: " + err)
          setLoadingStatus(false)
          return
        }

      }
      else {
        var isValidAddress =  ethers.utils.isAddress(cryptoAddresses[i])
        if(!isValidAddress){
          alert("Invalid Address on index " + String(i) +  " for " + cryptoAddresses[i])
          setLoadingStatus(false)
          return
        }
      }

    }
    setLoadingStatus(false)
    console.log("Printing cryptoAddresses: ", cryptoAddresses)

    cryptoAddresses = cryptoAddresses.filter( onlyUnique );
    if(cryptoAddresses.length != initial_len){
      alert("Duplicate addresses found")
      return
    }
    setCryptoRequestAddresses(cryptoAddresses.toString())
    completeStep2BatchRequestCrypto(cryptoAddresses.toString(), cryptoRequestAmount, cryptoRequestCurrency)
  }

  return (
    <>
    <h3>Step 2 - Crypto Request (Batch Request)</h3>
    <br />
    <h6>Enter list of addresses / ENS / Unstoppable domains to send your payment request to separated by a comma</h6>
    <InputText placeholder="Enter list of addresses / ENS / Unstoppable domains separated by a comma" style={{width:"100%"}} value={cryptoRequestAddresses} onChange={(e) => setCryptoRequestAddresses(e.target.value)} />
    <br />
    <br />
    <h6>Choose chain & crypto to request</h6>
    <RadioButton value="ethereum" onChange={(e) => {setCryptoRequestCurrency(e.value)}} checked={cryptoRequestCurrency === 'ethereum'} />
    <label style={{marginLeft:"10px", marginRight:"20px"}} >  Ethereum (Goerli Testnet) (ETH)</label>
    <RadioButton value="polygon" onChange={(e) => {setCryptoRequestCurrency(e.value)}} checked={cryptoRequestCurrency === 'polygon'} />
    <label style={{marginLeft:"10px"}} > Polygon (Mumbai Testnet) (MATIC)</label>
    <br />
    <br />
    <h6>Enter amount you would like to request the above addresses !</h6>
    <InputText placeholder="Enter Request Amount" style={{width:"50%"}} value={cryptoRequestAmount} onChange={(e) => setCryptoRequestAmount(e.target.value)} />
    <br />
    <br />
    <Button label="Confirm Details" loading={loadingStatus} onClick={async ()=>{
        if(!cryptoRequestAddresses || !cryptoRequestAmount || !cryptoRequestCurrency){
            alert("Please fill all the details")
            return
        }
        else {
          validateBatchCryptoRequest()
        }
        }}/>
    </>
  )
}

export default RequestStep2BroadcastCrypto