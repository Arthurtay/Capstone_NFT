import { useState, useEffect } from 'react'
import { Row, Col, Card } from 'react-bootstrap'

function renderItems(items) {
  return (
    <>
      <h2>Transfered</h2>
      <Row xs={1} md={2} lg={4} className="g-4 py-3">
        {items.map((item, idx) => (
          <Col key={idx} className="overflow-hidden">
            <Card>
              <Card.Footer>
               {item.name} 
               {item.description} 
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default function MyListedItems({ user, nft, account }) {
  // State Variable
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const [transferedItems, setTransferedItems] = useState([])

  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await user.itemCount()
    let listedItems = []
    let transferedItems = []
    for (let index = 1; index <= itemCount; index++) {
      const i = await user.items(index)

      if (i.minter.toLowerCase() == account) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId)

        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
    
        // define listed item object
        let item = {
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,

        }
        listedItems.push(item)
        // Add listed item to sold items array if sold
        if (i.transfered) {
          transferedItems.push(item)
        }
        
      }
    }
    setLoading(false)
    setListedItems(listedItems)
    setTransferedItems(transferedItems)
  }
  useEffect(() => {
    loadListedItems()
  }, [])


  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {listedItems.length > 0 ?
        <div className="px-5 py-3 container">
            <h2>Listed</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {listedItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Footer> {item.name} ETH</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
            {transferedItems.length > 0 && renderItems(transferedItems)}
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No Accounts Listed</h2>
          </main>
        )}
    </div>
  );
}