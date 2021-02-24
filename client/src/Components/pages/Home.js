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
                    <h1>Leviathan</h1>
                    <p>
                        This is a modified jumbotron that occupies the entire horizontal space of
                        its parent.
                    </p>
                </Container>
            </Jumbotron>
        );
    };
};