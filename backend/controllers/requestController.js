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

const rejectNftRequest = async (req, res)=>{
    try {

        // verify signature
        const signature = req.body.requestSignature
        const requestId = req.body.requestId
        const message = req.body.message
        const nft_contract_address = req.body.nft_contract_address
        const nft_token_id = req.body.nft_token_id
        const chain = req.body.chain
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
        if(recovered != req.body.requestReceiver){
            res.status(400);
            res.send("Signature Validation Failed - Invalid Sender")
        }


        notificationController.sendTargetedNotificationRejectNFT(nft_contract_address, nft_token_id, chain, req.body.requestReceiver, req.body.requestSender)


        // delete document with id request_id from db
        await Request.deleteOne({_id: requestId})

        res.send("Request rejected successfully")


    }
    catch(err){
        console.error(err)
    }
}


const rejectCryptoRequest = async (req, res)=>{
    try {
        // verify signature
        const signature = req.body.requestSignature
        const requestId = req.body.requestId
        const message = req.body.message
        const chain = req.body.chain
        const amount = req.body.amount
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
        if(recovered != req.body.requestReceiver){
            res.status(400);
            res.send("Signature Validation Failed - Invalid Sender")
        }

        notificationController.sendTargetedNotificationRejectCrypto(chain, amount, req.body.requestReceiver, req.body.requestSender)

        await Request.deleteOne({_id: requestId})

        res.send("Request rejected successfully")

    }
    catch(err){
        console.error(err)
    }

}

const confirmCryptoRequest = async (req, res)=>{
    try {
        const signature = req.body.requestSignature
        const chain = req.body.chain
        const amount = req.body.amount
        const requestId = req.body.requestId
        const message = req.body.message
        const txHash = req.body.txHash

        var chain_id;
        if(chain=="MATIC"){
            chain_id = 80001
        }
        else if(chain=="ETH"){
            chain_id = 5
        }

        // make a call to covalent API to validate transaction hash
        // make a call to covalent API 
        const APIKEY = process.env.COVALENT_API_KEY
        const baseURL = 'https://api.covalenthq.com/v1'
        const ChainId = String(chain_id)
        const url = new URL(`${baseURL}/${ChainId}/transaction_v2/${txHash}/?key=${APIKEY}`);
        const response = await fetch(url);
        const result = await response.json();
        // console.log("Printing result of covalent API call")
        // console.log(result)

        try {
            const data = result.data
            const data_items = data.items
            const from_address = data_items[0].from_address
            if(from_address.toLowerCase() == req.body.requestReceiver.toLowerCase() && data_items[0].successful){
                console.log("Sender is valid")
            }
            else{
                console.log("Invalid sender")
                res.status(400);
                res.send("Invalid Sender")
            }

        }

        catch(err){
            console.log("Error: ", err)
            res.status(400)
            res.send("Invalid transaction hash")
        }

        await notificationController.sendTargetedNotificationCryptoSuccess(chain, amount, req.body.requestReceiver, req.body.requestSender)

        await Request.deleteOne({_id: requestId})

        res.send("Request confirmed successfully")

    }
    catch(err){
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

module.exports = {getAllRequests, createRequest, getReceivedRequests, getSentRequests, createBatchRequests, rejectNftRequest, rejectCryptoRequest, confirmCryptoRequest}