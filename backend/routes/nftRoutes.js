const express = require("express")
const nftController = require("../controllers/nftController")

const router = express.Router()

router.get("/owned/:id/:chain", nftController.getOwnedNfts)

router.get("/details/:address/:token_id/:chain", nftController.getNftDetails)

module.exports = router