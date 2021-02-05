// Modules
import React, { Component } from 'react';
import { Jumbotron, Container, ListGroup, Row, Col, Image, Button, Nav } from 'react-bootstrap';
import { Redirect, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons';
// Icons
import { faPlus } from '@fortawesome/free-solid-svg-icons';

library.add(faStroopwafel);


///////////////////////////////////////////////////////////////////////////////////////////
// ! TO FINISH
///////////////////////////////////////////////////////////////////////////////////////////


// Sub Components
const About = () => {
    return (
        <Jumbotron fluid>
            <Container >
                <h2>About</h2>
            </Container>
        </Jumbotron>
    );
};

const Messages = () => {

    return (
        <Jumbotron fluid>
            <Container >
                <Row>

                </Row>
            </Container>
        </Jumbotron>
    );
};

const Favorite = () => {
    return (
        <Jumbotron fluid>
            <Container >
                <h2>Test</h2>
            </Container>
        </Jumbotron>
    );
};

const PersonalArea = () => {

    // Taking the user from DB - Redux
    const { userName } = useParams();
    const data = useSelector((state) => state.users);
    // console.log(userName);
    const user = data.filter(user => user.userName === userName);
    // console.log(thisUser[0].email);
    const thisUser = user[0];

    // Setting the Date from DB's Informations 
    const date = new Date(thisUser.createdAt);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Return the Component
    return (
        <Jumbotron fluid>
            <Container >
                <h2>Infos</h2>
                <Row>
                    <Col xs={6} md={6}>
                        <ListGroup>
                            <ListGroup.Item>{thisUser.userName}</ListGroup.Item>
                            <ListGroup.Item>{thisUser.name.firstName}</ListGroup.Item>
                            <ListGroup.Item>{thisUser.name.lastName}</ListGroup.Item>
                            <ListGroup.Item>{thisUser.type}</ListGroup.Item>
                            <ListGroup.Item>{`${date.getDate()} of ${months[date.getMonth()]} ${date.getFullYear()} - ${days[date.getDay()]} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}</ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col xs={6} md={6}>
                        <ListGroup>
                            <ListGroup.Item><Button>Private Messages</Button></ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </Jumbotron>
    );
};


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


// Main Component
export default class ProfileEditInfo extends Component {

    // Constructor
    constructor(props) {
        super(props);

        // Data of the logged User
        const data = JSON.parse(localStorage.getItem('Leviathan'));

        // Redirect to the login page if there is no User logged
        if (data === null) {
            // State
            this.state = {
                guest: true
            };
        } else {
            // State
            this.state = {
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                render: 'About',
                guest: false
            };
        }

        // console.log(this.props.match.params);
    };


    ///////////////////////////////////////////////////////////////////////////////////////////


    // * Functions

    // Take and set the name of the Sub-Component to render
    handleClick(component) {
        // console.log(component);
        this.setState({ render: component });
    };

    // Render the Component selected
    _renderSubComp() {
        switch (this.state.render) {
            case 'About': return <About />
            case 'Messages': return <Messages />
            case 'Favorite': return <Favorite />
            case 'PersonalArea': return <PersonalArea />
            default: return <About />
        };
    };


    ///////////////////////////////////////////////////////////////////////////////////////////


    // Render
    render() {

        if (this.state.guest) {
            return <Redirect to={{
                pathname: "/unauthorized",
                state: { message: 'Unauthorized' }
            }} />
        } else {
            return (
                <>
                    {/* Title, Profile Picture, Edit Button */}
                    <Jumbotron fluid>
                        <Container >
                            <Row>
                                <Col md={4}>
                                    <Image src='/images/profilePicture/test.jpg' thumbnail />
                                </Col>
                                <Col md={4}>
                                    <h1>{this.props.match.params.userName}</h1>
                                </Col>
                                {
                                    !this.state.guest ?
                                        <Col md={4}>
                                            <Button>Change Password</Button>
                                            <Button>Change E-Mail</Button>
                                            <Button>Edit Infos</Button>
                                        </Col> : null
                                }
                            </Row>
                        </Container>
                    </Jumbotron>

                    <Row>
                        <Col>
                            <Nav justify variant="tabs">
                                {
                                    this.state.render === 'About' ?
                                        <Nav.Item>
                                            <Nav.Link eventKey="link-3" onClick={this.handleClick.bind(this, 'About')} active>About</Nav.Link>
                                        </Nav.Item>
                                        :
                                        <Nav.Item>
                                            <Nav.Link eventKey="link-3" onClick={this.handleClick.bind(this, 'About')}>About</Nav.Link>
                                        </Nav.Item>
                                }
                                <Nav.Item>
                                    <Nav.Link eventKey="link-1" onClick={this.handleClick.bind(this, 'Messages')}>Messages</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="link-2" onClick={this.handleClick.bind(this, 'Favorite')}>Favorite</Nav.Link>
                                </Nav.Item>
                                {
                                    !this.state.guest ?
                                        <Nav.Item>
                                            <Nav.Link eventKey="disabled" onClick={this.handleClick.bind(this, 'PersonalArea')}>Personal Area</Nav.Link>
                                        </Nav.Item> : null
                                }
                            </Nav>
                        </Col>
                    </Row>

                    <Row>
                        <Col id='panel'>
                            {this._renderSubComp()}
                        </Col>
                    </Row>
                </>
            );
        };
    };
};