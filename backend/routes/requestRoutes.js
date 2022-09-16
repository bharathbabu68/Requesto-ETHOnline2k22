const express = require("express")
const requestController = require("../controllers/requestController")

const router = express.Router()

router.get("/getAllRequests", requestController.getAllRequests)

router.post("/createRequest", requestController.createRequest)

module.exports = router