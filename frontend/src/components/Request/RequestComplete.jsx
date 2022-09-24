import React from 'react'

const RequestComplete = () => {
  return (
    <>
    <h1 style={{color: "black"}}>Hoooraaah!</h1>
    <img style={{borderRadius: "20px"}} class="image-blurred-edge" width="590px" src="https://requesto.infura-ipfs.io/ipfs/QmYnZutPbBjXoNdHy8DnWygSVtk9YJs8hJ56GrGws1nPiw"></img>
    <br></br>
    <h2>Your request was sent succesfully!!</h2>
    {/* <br></br> */}
    {/* <h6>Share Requesto to your friends</h6> */}
    <button class="btn-theme icon-left" style={{textAlign: "center", marginLeft: "-490px"}}><i class="pi pi-twitter"></i>
      Tweet about Requesto to your friends!<a style={{textDecoration: "none"}} href="http://twitter.com/share?text=I just created my first Web3 request using Requesto. Creating a request takes only 3 steps with options for NFT requests, Single/Batch Crypto requests!!&url=https://twitter.com/bharathbabu3017&hashtags=Requesto"></a>
    </button>
    </>
  )
}

export default RequestComplete