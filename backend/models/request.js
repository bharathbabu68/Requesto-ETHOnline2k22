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
    paymentData: {
        type: String,
    },
    nftData: {
        type: String,
    },
    requestSignature: {
        type: String,
        required: true
    },
    requestStatus: {
        type: String,
    }

})

const Request = mongoose.model("request", requestSchema);

module.exports = Request;