import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import Registration from "./Registration";

import ButtonMui from '@material-ui/core/Button';
import ModalDialog from './ModalDialog.js';

const Navigation = ({ web3Handler, account }) => {

    const [open, setOpen] = useState(false);

    // function to handle modal open
    const handleOpen = () => {
        setOpen(true);
    };
    // function to handle modal close
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Navbar expand="lg" bg="secondary" variant="dark">
            <Container>
                <Navbar.Brand>
                    &nbsp; TeleMedicine
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/create">Create</Nav.Link>
                        <Nav.Link as={Link} to="/listeditems">My Listed Items</Nav.Link>
                        <Nav.Link as={Link} to="/tokens">User Account Token</Nav.Link>
                        <Nav.Link as={Link} to="/admins">Admin</Nav.Link>
                    </Nav>

             

                   
                    <Nav>
                        {account ? (
                      
                                     
                            <Nav.Link
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>

                                <Button onClick={handleOpen} variant="outline-light">Register</Button>
                                <ModalDialog open={open} handleClose={handleClose} account={account}  />
                            </Nav.Link>
                                    
                        ) : (
                            <Button onClick={web3Handler}   variant="outline-light">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;