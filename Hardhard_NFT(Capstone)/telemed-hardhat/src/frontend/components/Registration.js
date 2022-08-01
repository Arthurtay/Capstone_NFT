import { useState, useEffect } from 'react'
//import { Row, Form, Button } from 'react-bootstrap'
// create an instance of the HTTP API client
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import { makeStyles } from '@material-ui/core';
//import { TextField } from '@material-ui/core/TextField';
//import { Button } from '@material-ui/core/Button';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),

    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '300px',
    },
    '& .MuiButtonBase-root': {
      margin: theme.spacing(2),
    },
  },
}));






const Registration = ({ account , handleClose }) => {
  
  /*
  
        <Typography gutterBottom>
           {account}
          </Typography>
  */
  /*
  useEffect(() => {

    fetch("/users")
      .then((res) => res.json())
      .then((data) => setData(data));
        
  console.log(data.id)
  loadItems()  
  console.log("this was called")
  }, [])
*/

  
  const classes = useStyles();
  // create state variables for each input
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  //const [email, setEmail] = useState('');
  const [walletaddress, setWalletAddress ] = useState(account);

  const handleSubmit = async () =>  {
    console.log(name,role, walletaddress );
    handleClose();
   console.log("this is called")
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, role:role , walletaddress:walletaddress , minted:false})
    };
    
    fetch('/addUser', requestOptions)
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
        this.setState({ errorMessage: error.toString() });
        console.error('There was an error!', error);
    });

    console.log("sucess")

  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField
        label="Name"
        variant="filled"
        required
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <TextField
        label="Doctor or Patient?"
        variant="filled"
        required
        value={role}
        onChange={e => setRole(e.target.value)}
      />


      <div>
        <Button variant="contained" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Signup
        </Button>
      </div>
    </form>
  );
};

export default Registration;