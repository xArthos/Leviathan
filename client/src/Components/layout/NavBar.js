// Modules
import React, { Component } from 'react';
import { Link } from "react-router-dom";

// Bootstrap Components
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons';
// Icons
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faServer } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

library.add(faStroopwafel);

export default class NavBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: 'John Doe',
            isLogged: false
        }
    };
    render() {
        return (
            <Navbar bg="dark" expand="lg" variant="dark">
                <Link className="navbar-brand" to='/'>React-Bootstrap</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">

                    <Nav className="mr-auto">
                        <Link className="nav-link" to='/'>Home</Link>
                        <Link className="nav-link" to='/'>Home</Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <Link className="dropdown-item" to='#action/3.1'>Home</Link>
                            <Link className="dropdown-item" to='#action/3.2'>Home</Link>
                            <Link className="dropdown-item" to={`/about/${this.state.name}`}>About</Link>
                            <NavDropdown.Divider />
                            <Link className="dropdown-item" to='/contact'>Contact</Link>
                        </NavDropdown>
                    </Nav>

                    <Nav>
                        {
                            this.state.isLogged ?
                                <>
                                    <Link className="nav-link" to='/profile'>Welcome {this.state.name}!</Link>
                                    <Link className="nav-link" to='/user/logOut'><FontAwesomeIcon icon={faSignOutAlt} rotation={180}></FontAwesomeIcon> Log out</Link>
                                </> :
                                <>
                                    <Link className="nav-link" to='/user/signIn'><FontAwesomeIcon icon={faSignInAlt}></FontAwesomeIcon> Log In</Link>
                                    <Link className="btn btn-warning" to='/user/signUp'><FontAwesomeIcon icon={faServer}></FontAwesomeIcon> Become a member!</Link>
                                </>
                        }
                    </Nav>

                </Navbar.Collapse>
            </Navbar>
        );
    };
};