const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const requestSchema = new Schema({
    requestType: {
        type: Number,
        required: true,
    },
    requestSender: {
        type: String,
        required: true,
    },
    requestReceiver: {
        type: String,
        required: true,
    },
    chosenChain: {
        type: Number,
        required: true,
    },
    chosenToken: {
        type: String
    },
    amount: {
        type: String
    },
    nftData: {
        type: String,
        required: true,
    },
    requestSignature: {
        type: String,
        required: true
    },
    requestStatus: {
        type: String,
        required: true,
    }

})

const Request = mongoose.model("request", requestSchema);

module.exports = Request;