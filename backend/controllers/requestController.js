const Request = require("../models/request")
const ethers = require("ethers")
const notificationController = require("../controllers/notificationController")
require("dotenv").config()

const getAllRequests = async (req, res)=>{
    const requests = await Request.find({})
    console.log("Requests from DB: ", requests)
    res.send(requests)
}

const createRequest = async (req, res)=>{
    try {
        if(req.body.requestType == 1){
            // this is a NFT request

            // validate signature
            const signature = req.body.requestSignature
            const data = await fetch(req.body.nftData)
            const data_json = await data.json()
            const message = JSON.stringify(data_json)
            let abi = [
                "function verifyString(string, uint8, bytes32, bytes32) public pure returns (address)"
            ];
            let contractAddress = process.env.SIGNATURE_VERIFIER_CONTRACT_ADDRESS
            const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_TESTNET_INFURA_ENDPOINT);
            let contract = new ethers.Contract(contractAddress, abi, provider);
            // let sig = ethers.utils.splitSignature(signature);
            let sig;
            try {
                sig = ethers.utils.splitSignature(signature);
            }
            catch (err) {
                res.status(400)
                res.send("Signature Validation Failed - Invalid Signature")
            }
            let recovered = await contract.verifyString(message, sig.v, sig.r, sig.s);
            if(recovered != req.body.requestSender){
                res.status(400);
                res.send("Signature Validation Failed - Invalid Sender")
            }
            const newRequest = new Request({
                requestType: req.body.requestType,
                requestSender: req.body.requestSender,
                requestReceiver: req.body.requestReceiver,
                nftData: req.body.nftData,
                requestSignature: req.body.requestSignature,
                requestStatus: "sent"
            })
            await newRequest.save()
            var opensea_link = `https://opensea.io/assets/${data_json.chain=="ethereum"?"ethereum":"matic"}/${data_json.nft_contract_address}/${data_json.nft_token_id}`
            notificationController.sendTargetedNotificationNFT("NFT", req.body.requestSender,req.body.requestReceiver,  data_json.nft_contract_address, data_json.nft_token_id, opensea_link, data_json.token_metadata)
            res.send("NFT request sent")
        }
        else if(req.body.requestType == 2){
            // this is a payment request
            const signature = req.body.requestSignature
            const data = await fetch(req.body.paymentData)
            const data_json = await data.json()
            const message = JSON.stringify(data_json)
            let abi = [
                "function verifyString(string, uint8, bytes32, bytes32) public pure returns (address)"
            ];
            let contractAddress = process.env.SIGNATURE_VERIFIER_CONTRACT_ADDRESS
            const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_TESTNET_INFURA_ENDPOINT);
            let contract = new ethers.Contract(contractAddress, abi, provider);
            // let sig = ethers.utils.splitSignature(signature);
            let sig;
            try {
                sig = ethers.utils.splitSignature(signature);
            }
            catch (err) {
                res.status(400)
                res.send("Signature Validation Failed - Invalid Signature")
            }
            let recovered = await contract.verifyString(message, sig.v, sig.r, sig.s);
            if(recovered != req.body.requestSender){
                res.status(400);
                res.send("Signature Validation Failed - Invalid Sender")
            }
            const newRequest = new Request({
                requestType: req.body.requestType,
                requestSender: req.body.requestSender,
                requestReceiver: req.body.requestReceiver,
                paymentData: req.body.paymentData,
                requestSignature: req.body.requestSignature,
                requestStatus: "sent"
            })
            notificationController.sendTargetedNotificationCrypto(req.body.requestSender, req.body.requestReceiver, data_json.chain, data_json.amount)
            await newRequest.save()
            res.send("Payment request sent")
        }
        else{
            res.status(400);
            res.send("Invalid request type")
        }
    }
    catch(err){
        console.error(err)
    }
    
}


const createBatchRequests = async (req, res)=>{
    try {
        if(req.body.requestType == 2){
            // payment request only accepted for batch requests

            // validate signature
            const signature = req.body.requestSignature
            const data = await fetch(req.body.paymentData)
            const data_json = await data.json()
            const message = JSON.stringify(data_json)
            let abi = [
                "function verifyString(string, uint8, bytes32, bytes32) public pure returns (address)"
            ];
            let contractAddress = process.env.SIGNATURE_VERIFIER_CONTRACT_ADDRESS
            const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_TESTNET_INFURA_ENDPOINT);
            let contract = new ethers.Contract(contractAddress, abi, provider);
            // let sig = ethers.utils.splitSignature(signature);
            let sig;
            try {
                sig = ethers.utils.splitSignature(signature);
            }
            catch (err) {
                res.status(400)
                res.send("Signature Validation Failed - Invalid Signature")
            }
            let recovered = await contract.verifyString(message, sig.v, sig.r, sig.s);
            if(recovered != req.body.requestSender){
                res.status(400);
                res.send("Signature Validation Failed - Invalid Sender")
            }

            // create batch request
            var all_receivers = data_json.receiver_addresses;
            all_receivers = all_receivers.split(",")

            // do a subset notification using EPNS
            // for epns notifications add eip155:42: before every receiver address
            var epns_receivers = []
            for(var i=0; i<all_receivers.length; i++){
                epns_receivers.push("eip155:42:"+all_receivers[i])
            }

            notificationController.sendSubsetNotificationCrypto(req.body.requestSender, epns_receivers, data_json.chain, data_json.amount)


            // loop through all receivers and add to db
            for(var i =0 ; i < all_receivers.length; i++) {
                // add request to db
                var newRequest = new Request({
                    requestType: req.body.requestType,
                    requestSender: req.body.requestSender,
                    requestReceiver: all_receivers[i],
                    paymentData: req.body.paymentData,
                    requestSignature: req.body.requestSignature,
                    requestStatus: "sent"
                })
                await newRequest.save()
            }

            res.send("Batch Payment requests sent")


        }

        else {
            res.status(400);
            res.send("Invalid request type")
        }


    }
    catch (err) {
        console.error(err)
    }
}

const getReceivedRequests = async (req, res) => {
    const user_addr = req.params.id
    const requests = await Request.find({requestReceiver: user_addr})
    res.send(requests)
}

const getSentRequests = async (req, res) => {
    const user_addr = req.params.id
    const requests = await Request.find({requestSender: user_addr})
    res.send(requests)
}

module.exports = {getAllRequests, createRequest, getReceivedRequests, getSentRequests, createBatchRequests}