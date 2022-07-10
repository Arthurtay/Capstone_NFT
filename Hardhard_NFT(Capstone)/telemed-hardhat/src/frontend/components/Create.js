import { useState } from 'react'
import { Row, Form, Button } from 'react-bootstrap'
// create an instance of the HTTP API client
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Create = ({  user, nft }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const createNFT = async () => {
    //Ensure Fields are not empty
    if (!name || !description) return
    try{
      // store NFT meta data in IPFS
      const result = await client.add(JSON.stringify({name, description}))
      mintThenList(result)
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const mintThenList = async (result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`
    // mint nft 
    await(await nft.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()

    // approve  to spend nft
    await(await nft.setApprovalForAll(user.address, true)).wait()

    // add NFT to user contract
    await(await user.createAccount(nft.address, id)).wait()
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create