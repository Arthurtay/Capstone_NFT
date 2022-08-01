import { useState, useEffect } from 'react'
import { Row, Col, Card } from 'react-bootstrap'

export default function MyToken({ user, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [tokenInPossesion, setTokenInPossesion] = useState([])
  const loadAccountToken = async () => {
    // Fetch Accounts by quering events
    const filter =  user.filters.Distribute(null,null,null,null,account)
    const results = await user.queryFilter(filter)

    //Fetch metadata of each nft and add that to listedItem object.
    const tokenInPossesion = await Promise.all(results.map(async i => {
      // fetch arguments from each result
      i = i.args
      // get uri url from nft contract
      const uri = await nft.tokenURI(i.tokenId)
      // use uri to fetch the nft metadata stored on ipfs 
      const response = await fetch(uri)
      const metadata = await response.json()
      console.log(metadata)
      // define listed item object
      let Item = {
        itemId: i.itemId,
        name: metadata.name,
        role: metadata.role,
        hash: metadata.hash
      }

      return Item
    }))
    setLoading(false)
    setTokenInPossesion(tokenInPossesion)
  }
  
  useEffect(() => {
    loadAccountToken()

    
  }, [])
  
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )


  return (
    <div className="flex justify-center">
      {tokenInPossesion.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {tokenInPossesion.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top"  />
                  <Card.Footer>Name: {item.name} </Card.Footer>
                  <Card.Footer>Role: {item.role} </Card.Footer>
                  <Card.Footer>Hash: {item.hash} </Card.Footer>

                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No account token in Possesion</h2>
          </main>
        )}
    </div>
  );
}