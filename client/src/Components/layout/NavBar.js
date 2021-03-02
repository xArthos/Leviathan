// Modules
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Redirect } from 'react-router';

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


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


// Main Component
export default class MainNavBar extends Component {

    // Constructor
    constructor(props) {
        super(props);

        let data = JSON.parse(localStorage.getItem('Leviathan'));

        if (data === null) {
            data = false
        };

        // State
        this.state = {
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            redirect: false
        };

        // console.log(this.state);

        this.logOut = this.logOut.bind(this);
    };

    logOut = (event) => {
        event.preventDefault();

        localStorage.removeItem('Leviathan');

        this.setState({
            user: undefined,
            accessToken: undefined,
            refreshToken: undefined,
            redirect: true
        });
    };

    render() {
        return (
            <>
                <Navbar expand="lg" variant="dark" id='navbar'>
                    <Link className="navbar-brand" to='/'>
                        <img src="/images/leviatahan_logo_s.png"
                            width="110"
                            height="75"
                            className="d-inline-block align-top"
                            alt="Leviathan logo"
                        />
                    </Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">

                        {/* Left Navbar Side */}
                        <Nav className="mr-auto">
                            <Link className="nav-link" to='/'>Home</Link>
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <Link className="dropdown-item" to='/allUsersList'>All Users</Link>
                                <Link className="dropdown-item" to='/wikis'>All wikis</Link>
                                <Link className="dropdown-item" to={`/about/${this.state.name}`}>About</Link>
                                <NavDropdown.Divider />
                                <Link className="dropdown-item" to='/contact'>Contact</Link>
                            </NavDropdown>
                        </Nav>

                        {/* Right Navbar Side */}
                        <Nav>
                            {
                                this.state.user ?
                                    <>
                                        <Link className="nav-link" to={`/profile:${this.state.user.userName}`}>Welcome {this.state.user.userName}!</Link>
                                        <Link className="nav-link" to='/logOut' onClick={this.logOut}><FontAwesomeIcon icon={faSignOutAlt} rotation={180} /> Log out</Link>
                                    </> :
                                    <>
                                        <Link className="nav-link" to='/login'><FontAwesomeIcon icon={faSignInAlt} /> Log In</Link>
                                        <Link className="btn btn-warning register-btn" to='/register'><FontAwesomeIcon icon={faServer} /> Become a member!</Link>
                                    </>
                            }
                        </Nav>

                    </Navbar.Collapse>
                </Navbar>

                {
                    this.state.redirect ?
                        <Redirect to={{
                            pathname: '/success',
                            state: {
                                message: 'Loged Out succesufully'
                            }
                        }} /> : null
                }
            </>
        );
    };
};