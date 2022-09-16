const express = require("express")
const nftController = require("../controllers/nftController")

const router = express.Router()

router.get("/owned/:id/:chain", nftController.getOwnedNfts)

module.exports = router