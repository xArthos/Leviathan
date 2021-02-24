// Modules
import React, { Component } from 'react';
import { Jumbotron, Container } from 'react-bootstrap';


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


// Main Component
export default class Main extends Component {

    // Render
    render() {
        return (
            <Jumbotron fluid>
                <Container>
                    <h1>Account Verified Succesufully!</h1>
                </Container>
            </Jumbotron>
        );
    };
};