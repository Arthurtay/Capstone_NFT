import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useState,useEffect,componentDidMount } from 'react'
import Button from '@mui/material/Button';
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

/*
useEffect(() => {
    const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "startDate": "2020-02-01","endDate": "2021-02-15"})
    };
  fetch("https://localhost:44364/api/containersense/Container/GetByDate/ ",requestOptions)
    .then(res => res.json())
    .then(
      (result) => {
        setContainer(result);
      },
    )
    .catch((error) => {
      console.log(error)
    });
}, [])
*/






export default function Admin({ user, nft,account }) {

  const [loading, setLoading] = useState(true)
  const [data, setData ] = useState([])
  //const [transferedItems, setTransferedItems] = useState([])

  useEffect(() => {
  
    fetch("/users")
      .then((res) => res.json())
      .then((data) => 
         setData(data)
         );
  }, [])

  //Add meta data to IPFS
  const createNFT = async (data) => {
    //Ensure Fields are not empty
    
    try{
        console.log("NFT CREATING ")
        console.log(data.Role)
        console.log(data.Username)
        var name = data.Username;
        var role = data.Role
      // store NFT meta data in IPFS
      const result = await client.add(JSON.stringify({name, role}))
       mintThenList(result,data.WalletAddress,data.id)
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const mintThenList = async (result,useraddress,key) => {

    console.log("processing database ")
    console.log(key)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minted: true, id: key })
    };
    
    fetch('/updateUser', requestOptions)
    .then(async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson && await response.json();

        // check for error response
        if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
        }
      
    })
    .catch(error => {
        // this.setState({ errorMessage: error.toString() });
        console.error('There was an error!', error);
    })

    const uri = `https://ipfs.infura.io/ipfs/${result.path}`
    // mint nft 
    await(await nft.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    console.log(account)
    console.log(id)

    // approve  to spend nft
    await(await nft.setApprovalForAll(user.address, true)).wait()
    console.log(user.address)
   // // add NFT to user contract to track the event
   / await(await user.createAccount(nft.address, id)).wait()
   // console.log(nft.adresss)
    await (await user.distributeAccountToken(id,useraddress)).wait()
    


  }



  

   console.log(data)
   console.log("you cool")

    return (
      <div className="px-5 mt-5 container">
      <TableContainer component={Paper} >
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell align="left">Role</TableCell>
            <TableCell align="left">WalletAddress</TableCell>
            <TableCell align="left">Minted</TableCell>  
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((data) => (
            <TableRow
              key={data.id}
            >
              <TableCell component="th" scope="row">
                {data.Username}
              </TableCell>
              <TableCell align="left">{data.Role}</TableCell>
              <TableCell align="left">{data.WalletAddress}</TableCell>
              <TableCell align="left">
                test
              </TableCell>
              <TableCell align="left"> 
              <Button   onClick={() => {
                           createNFT(data);
                     }} variant="outlined">Mint Token</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    );




    
  }


