const express = require("express")
const { AssertionError } = require("assert");

const app = express();
const bodyparser=require("body-parser");
var cors = require('cors')

app.use(bodyparser.json());
app.use(express.static("public"));
app.use(cors());
app.use(logger)

app.get("/", async (req, res) => {
    try {
        res.send("Hi")
    }
    catch(e) {
        console.error(e)
    }
    finally {

    }
})

function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}

app.listen(4000,()=>{
    console.log("listening here");
  })