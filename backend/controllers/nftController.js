require("dotenv").config()

// fetch owned NFTs
const getOwnedNfts = async (req, res) => {
    var result = []
     const account_address = req.params.id 
     const chain = req.params.chain
     const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.NFT_PORT_API_KEY
        }
      };
      
      fetch(`https://api.nftport.xyz/v0/accounts/${account_address}?chain=${chain}`, options)
        .then(response => response.json())
        .then(response => {
            const nfts = response['nfts']
            nfts.map(nft => {
                var obj = {
                    "contract_address": nft.contract_address,
                    "token_id": nft.token_id,
                    "chain": chain
                }
                result.push(obj)
            })
        })
        .then(response => {
            res.send(result)
        })
        .catch(err => console.error(err));
}


const getNftDetails = (req, res) => {
    // fetch NFT details
    const contract_address = req.params.address
    const token_id = req.params.token_id
    const chain = req.params.chain
    const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.NFT_PORT_API_KEY
        }
      };
      
      fetch(`https://api.nftport.xyz/v0/nfts/${contract_address}/${token_id}?chain=${chain}`, options)
        .then(response => response.json())
        .then(response => {
          if(response.response=="OK"){
          var result ={
            "response": response.response,
            "metadata_url": response['nft']['metadata'].image_url,
            "owner": response['owner']
          }
          res.send(result)
        }
        else{
          res.send(response)
        }
        })
        .catch(err => console.error(err));

}

module.exports = {getOwnedNfts, getNftDetails}