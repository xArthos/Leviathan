import React, { Component } from 'react';
import { Jumbotron, Container } from 'react-bootstrap';

export default class Main extends Component {

    render() {
        return (
            <Container className='mt-5'>
                {/* Title Start */}
                <Jumbotron fluid>
                    <Container>
                        <h1>Leviathan</h1>
                        <p>
                            This is a modified jumbotron that occupies the entire horizontal space of
                            its parent.
                        </p>
                    </Container>
                </Jumbotron>
                {/* Title Ends */}
            </Container>
        );
    };
};