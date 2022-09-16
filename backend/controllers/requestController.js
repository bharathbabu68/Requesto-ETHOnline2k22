const Request = require("../models/request")

const getAllRequests = async (req, res)=>{
    const requests = await Request.find({})
    console.log("Requests from DB: ", requests)
    res.send(requests)
}

const createRequest = async (req, res)=>{
    try {
        const newRequest = new Request({
            requestType: req.body.requestType,
            requestSender: req.body.requestSender,
            requestReceiver: req.body.requestReceiver,
            chosenChain: req.body.chosenChain,
            chosenToken: req.body.chosenToken ? req.body.chosenToken: "null",
            amount: req.body.amount,
            nftData: req.body.nftData ? req.body.nftData: "null",
            requestSignature: req.body.requestSignature,
            requestStatus: "null"
        })
        await newRequest.save()
        res.send("Request sent successfully !")
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