// Modules
import React, { Component } from 'react';
import { Jumbotron, Container } from 'react-bootstrap';


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


// Main Component
export default class ErrorPage extends Component {

    constructor(props) {
        super(props);

        // * State
        this.state = {
            message: this.props.message || this.props.location.state.message || 'Nothing to report'
        };
    };

    // Render
    render() {
        return (
            <Jumbotron fluid>
                <Container>
                    <h1>{this.state.message}</h1>
                </Container>
            </Jumbotron>
        );
    };
};