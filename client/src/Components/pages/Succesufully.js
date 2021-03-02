// Modules
import React, { Component } from 'react';
import { Jumbotron, Container } from 'react-bootstrap';


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


// Main Component
export default class Succesufully extends Component {

    constructor(props) {
        super(props);

        // * State
        this.state = {
            message: this.props.location.state.message,
            render: setTimeout(() => {
                this.props.history.push('/');
                window.location.reload(true);
            }, 1800)
        };


    };

    componentWillUnmount() {
        if (this.state.render) {
            clearTimeout(this.state.render);
        };
        window.location.reload(true);
    };

    // Render
    render() {
        return (
            <Jumbotron fluid className='header'>
                <Container>
                    <h1>{this.state.message}</h1>
                </Container>
            </Jumbotron>
        );
    };
};