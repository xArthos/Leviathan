// Modules
import React, { Component } from 'react';
import { Jumbotron, Container, ListGroup, Row, Col, Image, Button, Nav } from 'react-bootstrap';
import { Redirect, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons';
// import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
// Icons
// import { faPlus } from '@fortawesome/free-solid-svg-icons';

library.add(faStroopwafel);


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


// Main Component
export default class ProfileEditInfo extends Component {

    // Constructor
    constructor(props) {
        super(props);

    };


    ///////////////////////////////////////////////////////////////////////////////////////////


    // * Functions


    ///////////////////////////////////////////////////////////////////////////////////////////


    // Render
    render() {
        return (
            <></>
        );
    };
};