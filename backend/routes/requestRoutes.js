const express = require("express")
const requestController = require("../controllers/requestController")

const router = express.Router()

router.get("/getAllRequests", requestController.getAllRequests)

router.post("/createRequest", requestController.createRequest)

router.post("/createBatchRequests", requestController.createBatchRequests)

router.post("/rejectNftRequest", requestController.rejectNftRequest)

router.post("/rejectCryptoRequest", requestController.rejectCryptoRequest)

router.post("/confirmCryptoRequest", requestController.confirmCryptoRequest)

router.get("/getReceivedRequests/:id", requestController.getReceivedRequests)

router.get("/getSentRequests/:id", requestController.getSentRequests)

module.exports = router