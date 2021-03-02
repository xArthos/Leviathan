// Modules
import React, { Component } from 'react';
import { Card } from 'react-bootstrap';


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


// Main Component
export default class Footer extends Component {

    render() {
        return (
            <Card id='footer' className='text-center mt-5' bg='dark' text='white'>
                <Card.Body>
                    <Card.Title>Special title treatment</Card.Title>
                    <Card.Text>
                        With supporting text below as a natural lead-in to additional content.
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    };
};