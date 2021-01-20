// Modules
import React, { Component } from 'react';

// Bootstrap Components
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons';
// Icons
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faServer } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


library.add(faStroopwafel);

export default class MainNavBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: null
        }
    };

    render() {
        return (
            <Navbar bg="dark" expand="lg" variant="dark">
                <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">

                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

                    <Nav>
                        <Nav.Link href="/user/signIn"><FontAwesomeIcon icon={faSignInAlt}></FontAwesomeIcon> Sign-in</Nav.Link>
                        <Button variant="warning" href="#user/signUp"><FontAwesomeIcon icon={faServer}></FontAwesomeIcon> Become a member!</Button>

                        <Nav.Link href="#profile">Welcome {this.state.name}</Nav.Link>
                        <Nav.Link href="#user/logOut"><FontAwesomeIcon icon={faSignOutAlt} rotation={180}></FontAwesomeIcon> Log-out</Nav.Link>
                    </Nav>

                </Navbar.Collapse>
            </Navbar>
        );
    };
};