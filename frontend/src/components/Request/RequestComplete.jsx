import React from 'react'

const RequestComplete = () => {
  return (
    <>
    <div style={{textAlign:"center"}}>
    <h1  className='text-effect-2' style={{color: "black"}}>success</h1>
    <h5 style={{fontFamily:"Raleway"}}>Your request was sent succesfully!! You will be notified of any updates on your request using <a href="https://staging.epns.io/#/inbox">EPNS</a> ! You can view your request in the sent requests tab !</h5>
    <img style={{borderRadius: "20px", zIndex: "10 !important", textAlign:"center", margin:"auto", opacity:"1 !important"}} class="image-blurred-edge" width="350px" src="https://requesto.infura-ipfs.io/ipfs/QmYnZutPbBjXoNdHy8DnWygSVtk9YJs8hJ56GrGws1nPiw"></img>
    <button onClick={() => window.location.href = "http://twitter.com/share?text=I just created my first Web3 request using Requesto. Creating a request takes only 3 steps with options for NFT requests, Single/Batch Crypto requests!!&url=https://twitter.com/RequestoWeb3&hashtags=Requesto"} class="btn-theme icon-left" style={{textAlign: "center", marginLeft: "-490px"}}><i class="pi pi-twitter"></i>
      Tweet about Requesto to your frens!
    </button>
    </div>
    </>
  )
}

export default RequestComplete