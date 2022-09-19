const Request = require("../models/request")
const ethers = require("ethers")
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
            console.log("Message: ", message)
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
            console.log("For wrong signature - Signature: ", sig)
            let recovered = await contract.verifyString(message, sig.v, sig.r, sig.s);
            console.log("Recovered: ", recovered)
            if(recovered != req.body.requestSender){
                console.log(recovered)
                console.log(req.body.requestSender)
                res.status(400);
                res.send("Signature Validation Failed - Invalid Sender")
                return
            }
            else{
                console.log("Signature is valid")
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
            res.send("NFT request sent")
        }
        else if(req.body.requestType == 2){
            // this is a payment request
            const newRequest = new Request({
                requestType: req.body.requestType,
                requestSender: req.body.requestSender,
                requestReceiver: req.body.requestReceiver,
                paymentData: req.body.paymentData,
                requestSignature: req.body.requestSignature,
                requestStatus: "sent"
            })
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

module.exports = {getAllRequests, createRequest, getReceivedRequests, getSentRequests}