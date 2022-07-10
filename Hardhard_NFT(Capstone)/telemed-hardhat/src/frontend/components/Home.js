import { useState, useEffect } from 'react'
import { Row, Col, Card, Button ,Form } from 'react-bootstrap'


const Home = ({ user, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [useraddress,setUserAddress] = useState('')
  const [data,setData] = useState('')

  const loadItems = async () => {
 
    const itemCount = await user.itemCount()
    let items = []

    for (let i = 1; i <= itemCount; i++) {
      const item = await user.items(i)
      if (!item.transfered) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId)

        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()

        // Add item to items array
        items.push({
          itemId: item.itemId,
          minter: item.minter,
          name: metadata.name,
          description: metadata.description
        })
      }
    }
    setLoading(false)
    setItems(items)
  }

  const TransferTokenToUser = async (item) => {
    await (await user.distributeAccountToken(item.itemId,useraddress)).wait()
    loadItems()
  }


  useEffect(() => {
    loadItems()
  }, [])
  

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {items.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                    <Form.Control onChange={(e) => setUserAddress(e.target.value)} size="lg" required as="textarea" placeholder="Address" />
                      <Button onClick={() => TransferTokenToUser(item)} variant="primary" size="lg">
                        Transfer account
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}
export default Home;