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
import { sha256} from 'js-sha256';
import { ethers } from "ethers";
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
        console.log(sha256( data.Role + data.Username + data.WalletAddress ))
        console.log(data.Role)
        console.log(data.Username)
        var name = data.Username;
        var role = data.Role
        var hash = sha256( data.Role + data.Username + data.WalletAddress )
      // store NFT meta data in IPFS
      const result = await client.add(JSON.stringify({name, role,hash}))
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
    const start = performance.now()
//    const estimation = await nft.estimateGas.transfer(recipient, 100);

   const receipt_nft = await(await nft.mint(uri)).wait()
   const nft_gasUsed =  BigInt(receipt_nft.cumulativeGasUsed) * BigInt(receipt_nft.effectiveGasPrice);
   const nft_ethUsed = ethers.utils.formatEther(nft_gasUsed)
   
    // get tokenId of new nft 
    const id = await nft.tokenCount()


    // approve  to spend nft
    console.log("try again")
    const receipt_approve = await(await nft.setApprovalForAll(user.address, true)).wait()
    const approve_gasUsed =  BigInt(receipt_approve.cumulativeGasUsed) * BigInt(receipt_approve.effectiveGasPrice);
    const approve_ethUsed = ethers.utils.formatEther(approve_gasUsed);
    console.log(user.address)
   // // add NFT to user contract to track the event


   const receipt_create = await(await user.createAccount(nft.address, id)).wait()
   const create_gasUsed =  BigInt(receipt_create.cumulativeGasUsed) * BigInt(receipt_create.effectiveGasPrice);
   const create_ethUsed = ethers.utils.formatEther(create_gasUsed);

    
    const receipt_distribute = await (await user.distributeAccountToken(id,useraddress)).wait()
    const distribute_gasUsed =  BigInt(receipt_distribute.cumulativeGasUsed) * BigInt(receipt_distribute.effectiveGasPrice);
    const distribute_ethUsed = ethers.utils.formatEther(distribute_gasUsed);

    const duration = performance.now() - start;
                 
    

    var test =  nft_ethUsed +  approve_ethUsed + create_ethUsed + distribute_ethUsed 
    // nft_gasUsed  + approve_gasUsed +  create_ethUsed  + distribute_ethUsed 
    var total_ethUsed = parseFloat(nft_ethUsed) +  parseFloat(approve_ethUsed) + parseFloat(create_ethUsed) + parseFloat(distribute_ethUsed)
    //var total_ethUsed = ethers.utils.formatEther(total_gasUsed);
    
    console.log(test)
   console.log(total_ethUsed)

    console.log("Adding Log ")
  
    const requestOptions1 = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration: duration, total_gasUsed: total_ethUsed })
    };
    
    fetch('/addLog', requestOptions1)
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
                {String(data.Minted)}
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


