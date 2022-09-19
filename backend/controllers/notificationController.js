const EpnsAPI = require("@epnsproject/sdk-restapi");
const ethers = require("ethers")
require("dotenv").config()


const PK = process.env.EPNS_CHANNEL_PK// channel private key
const Pkey = `0x${PK}`
const signer = new ethers.Wallet(Pkey);

const sendTargetedNotificationNFT = async (request_type, sender_address, receiver_address, nft_contract_address, nft_token_id, opensea_link, token_metadata) => {
    try {
        const apiResponse = await EpnsAPI.payloads.sendNotification({
          signer,
          type: 3, // target
          identityType: 2, // direct payload
          notification: {
            title: `NFT Request`,
            body: `${sender_address} requested for your NFT with contract address ${nft_contract_address} and token ID ${nft_token_id}`,
          },
          payload: {
            title: `NFT Request`,
            body: `${sender_address} requested for your NFT with contract address ${nft_contract_address} and token ID ${nft_token_id}`,
            cta: opensea_link,
            img: token_metadata
          },
          recipients: `eip155:42:${receiver_address}`, // recipient address
          channel: `eip155:80001:${process.env.EPNS_CHANNEL_ADDR}`, // your channel address
          env: 'staging'
        });
        
        // apiResponse?.status === 204, if sent successfully!
        // console.log('API response: ', apiResponse);
        if(apiResponse?.status === 204){
            console.log("Notification sent successfully!")
        }
      } catch (err) {
        console.error('Error: ', err);
      }
}

const sendTargetedNotificationCrypto = async (sender_address, receiver_address, chain, amount) => {
  try {
      var image_url, currency_symbol;
      if(chain == "ethereum"){
        currency_symbol = "ETH"
        image_url = "https://requesto.infura-ipfs.io/ipfs/QmdUCaqRiN5R6WfJBMJrAwtW7iFD9R87kqby9jeG8ZjGzj"
      }
      else{
        currency_symbol = "MATIC"
        image_url = "https://requesto.infura-ipfs.io/ipfs/QmdUCaqRiN5R6WfJBMJrAwtW7iFD9R87kqby9jeG8ZjGzj"
      }
      const apiResponse = await EpnsAPI.payloads.sendNotification({
        signer,
        type: 3, // target
        identityType: 2, // direct payload
        notification: {
          title: `Payment Request`,
          body: `${sender_address} requested you for ${amount} ${currency_symbol} Click on this link to pay in Requesto platform `,
        },
        payload: {
          title: `Payment Request`,
          body: `${sender_address} requested you for ${amount} ${currency_symbol}. Click on this link to pay in Requesto platform `,
          cta: ``,
          img: image_url
        },
        recipients: `eip155:42:${receiver_address}`, // recipient address
        channel: `eip155:80001:${process.env.EPNS_CHANNEL_ADDR}`, // your channel address
        env: 'staging'
      });
      
      // apiResponse?.status === 204, if sent successfully!
      // console.log('API response: ', apiResponse);
      if(apiResponse?.status === 204){
          console.log("Notification sent successfully!")
      }
    } catch (err) {
      console.error('Error: ', err);
    }
}

module.exports = {sendTargetedNotificationNFT, sendTargetedNotificationCrypto}