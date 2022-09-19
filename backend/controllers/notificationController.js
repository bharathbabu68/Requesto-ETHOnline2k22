const EpnsAPI = require("@epnsproject/sdk-restapi");
const ethers = require("ethers")
require("dotenv").config()


const PK = process.env.EPNS_CHANNEL_PK// channel private key
const Pkey = `0x${PK}`
const signer = new ethers.Wallet(Pkey);

const sendTargetedNotificationNFT = async (request_type, receiver_address, nft_contract_address, nft_token_id, opensea_link, token_metadata) => {
    try {
        const apiResponse = await EpnsAPI.payloads.sendNotification({
          signer,
          type: 3, // target
          identityType: 2, // direct payload
          notification: {
            title: `${request_type} Request`,
            body: `You have received a request from ${receiver_address} for your NFT with contract address ${nft_contract_address} and token ID ${nft_token_id}.`,
          },
          payload: {
            title: `${request_type} Request`,
            body: `You have received a request from ${receiver_address} for your NFT with contract address ${nft_contract_address} and token ID ${nft_token_id}`,
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

module.exports = {sendTargetedNotificationNFT}