// Modules
import React, { Component } from 'react';
import { Jumbotron, Container, ListGroup, Row, Col, Image, Button, Card, Nav, Alert, CardDeck } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Moment from 'react-moment';

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons';
// Icons
import { faPlus, faTrashAlt, faPen } from '@fortawesome/free-solid-svg-icons';

// Fontawesome Library
library.add(faStroopwafel);





///////////////////////////////////////////////////////////////////////////////////////////
//? ************************ # SUB-COMPONENTS
// ! TO FINISH

// Sub Components
const About = () => {

    // Component Return
    return (
        <Jumbotron fluid>
            <Container >
                <h2>About</h2>
                <hr />
            </Container>
        </Jumbotron>
    );
};

const Messages = () => {

    // Component Return
    return (
        <Jumbotron fluid>
            <Container >
                <h2>Test</h2>
                <hr />
            </Container>
        </Jumbotron>
    );
};

const Favorite = () => {

    // Component Return
    return (
        <Jumbotron fluid>
            <Container >
                <h2>Test</h2>
                <hr />
            </Container>
        </Jumbotron>
    );
};

const PersonalArea = () => {

    // Taking the user from Redux-Instance
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


    // Component Return
    return (
        <Jumbotron fluid>
            <Container >
                <h2>Infos</h2>
                <hr />
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
export default class Profile extends Component {

    // Constructor
    constructor(props) {
        super(props);

        // Data of the logged User
        const loggedUser = JSON.parse(localStorage.getItem('Leviathan'));

        //* State
        // Set the State if there's not a User logged
        if (loggedUser === null) {
            this.state = {
                // Logged User
                isLogged: false,

                // User's Infos
                user: '',
                userId: '',
                userName: this.props.match.params.userName,
                profilePicture: '',
                accessToken: '',
                refreshToken: '',
                userWikis: 0,
                wikiDatas: [],
                message: '',
                alertVariant: '',

                // Render by Default the sub-component 'About'
                render: 'About'
            };
        } else {
            this.state = {

                // Logged User
                isLogged: true,

                // User's Infos
                user: loggedUser.user,
                userId: loggedUser.user._id,
                userName: loggedUser.user.userName,
                profilePicture: loggedUser.user.profilePicture,
                accessToken: loggedUser.accessToken,
                refreshToken: loggedUser.refreshToken,
                userWikis: 0,
                wikiDatas: [],
                message: '',
                alertVariant: '',

                // Render by Default the sub-component 'About'
                render: 'About'
            };
        };

        // Binding Functions
        this.createNewWiki = this.createNewWiki.bind(this);
        this.deleteWiki = this.deleteWiki.bind(this);
    };




    ///////////////////////////////////////////////////////////////////////////////////////////
    //? ************************ FUNCTIONS


    //? ******************** Sub-Component Handlers **************************************
    // Take and set the name of the Sub-Component to render
    handleClick(component) {
        // console.log(component);
        this.setState({ render: component });
    };

    // Render the Component selected
    _renderSubComp() {
        if (this.state.isLogged) {
            switch (this.state.render) {
                case 'About': return <About />
                case 'Messages': return <Messages />
                case 'Favorite': return <Favorite />
                case 'PersonalArea': return <PersonalArea />
                default: return <About />
            }
        } else {
            switch (this.state.render) {
                case 'About': return <About />
                case 'Messages': return <Messages />
                case 'Favorite': return <Favorite />
                default: return <About />
            };
        };
    };
    //? **********************************************************************************


    //? **********************  Wiki Handlers ********************************************
    createNewWiki() {
        axios.post(`http://localhost:8010/wiki/create/${this.state.userId}`)
            .then(res => res.data.newWikiId)
            .then(id => this.props.history.push(`/profile:${this.state.userName}/newWikiPage/${id}`))
            .catch(err => console.log(err));
    };

    deleteWiki(wikiId) {
        axios.post(`http://localhost:8010/wiki/delete/${wikiId}`)
            .then((res) => {

                console.log(res);

                console.log(`${res.request.status} ${res.request.statusText}`);

                switch (res.request.status) {
                    case 200:
                        this.setState(res.data);
                        setTimeout(() => {
                            window.location.reload(true);
                        }, 2500);
                        break;

                    default:
                        break;
                };
            })
            .catch(err => console.log(err));
    };
    //? **********************************************************************************


    //? ******************** Load User's Wikis *******************************************
    componentDidMount() {
        axios.get(`http://localhost:8010/${this.state.userName}/wikis`)
            .then(res => {
                // console.log(res.data);
                this.setState({
                    userWikis: res.data.numberOfWikis,
                    wikiDatas: res.data.wikis
                })
                // console.log(this.state);
            })
            .catch(err => console.log(err));
    };
    //? **********************************************************************************


    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////




    // Render
    render() {
        return (
            <>
                {/* Title, Profile Picture, Edit Button */}
                <Jumbotron fluid>
                    <Row className='px-3'>
                        <Col md={3} className='text-center'>
                            <Image src={`http://localhost:8010/${this.props.match.params.userName}/profilePicture`} thumbnail />
                        </Col>
                        <Col md={7}>
                            <h1>{this.props.match.params.userName}</h1>
                        </Col>
                        {
                            this.state.isLogged ?
                                <Col md={2}>
                                    <Button variant='warning' onClick={() => this.props.history.push(`/profile:${this.state.user.userName}/edit`)}>
                                        <FontAwesomeIcon icon={faPen} style={{ color: 'red' }} /> Edit Profile
                                        </Button>
                                </Col> : null
                        }
                    </Row>
                </Jumbotron>

                {/* NavLinks Sub-Components */}
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
                                this.state.isLogged ?
                                    <Nav.Item>
                                        <Nav.Link eventKey="disabled" onClick={this.handleClick.bind(this, 'PersonalArea')}>Personal Area</Nav.Link>
                                    </Nav.Item> : null
                            }
                        </Nav>
                    </Col>
                </Row>

                {/* Subcomponent Section Rendering */}
                <Row>
                    <Col md='12' id='panel'>
                        {this._renderSubComp()}
                    </Col>
                </Row>

                {/* Title Wikis */}
                <Row>
                    <Col>
                        <Jumbotron fluid>
                            <Container>
                                <h2>{this.props.match.params.userName}'s Wikis: {this.state.userWikis}</h2>
                                {
                                    this.state.message !== '' ?
                                        <Alert variant={this.state.alertVariant}>
                                            {this.state.message}
                                        </Alert> : null
                                }
                            </Container>
                        </Jumbotron>
                    </Col>
                </Row>

                {/* User's Wikis Area */}
                <CardDeck>
                    {
                        this.state.isLogged ?
                            <Col md='3' key='newWikiCard'>
                                <Card className='bg-dark text-white'>
                                    <Card.Img src='images/test.jpg' alt='Card image' />
                                    <Card.ImgOverlay>
                                        <Card.Body className='d-flex flex-column align-items-center justify-content-around h-100 rgba-black-strong py-5 px-4'>
                                            <FontAwesomeIcon size='6x' icon={faPlus} />
                                            <br />
                                            <Button variant='warning' onClick={() => this.createNewWiki()}>
                                                Create a New Wiki Page
                                            </Button>
                                        </Card.Body>
                                    </Card.ImgOverlay>
                                </Card>
                            </Col>
                            :

                            null
                    }
                    {
                        this.state.wikiDatas.length !== 0 ?
                            this.state.wikiDatas.map((wiki) => {

                                return (
                                    <Col md='3' key={`${wiki._id}`}>
                                        <Card className='bg-dark text-white'>
                                            <Card.Img src='images/test.jpg' alt='Card image' />
                                            <Card.ImgOverlay className='d-flex flex-column align-items-center justify-content-between'>
                                                <Card.Title>{wiki.title}</Card.Title>
                                                <Card.Text>
                                                    <a href={`/wiki/${wiki._id}`}>Go to the Wiki</a>
                                                    <br />
                                                    Last update: <Moment fromNow>{wiki.updatedAt}</Moment>
                                                </Card.Text>
                                                {
                                                    this.state.isLogged ?
                                                        <FontAwesomeIcon
                                                            title='Delete permantely this page'
                                                            className='position-absolute align-self-end delete-icon'
                                                            onClick={() => this.deleteWiki(`${wiki._id}`)}
                                                            icon={faTrashAlt}
                                                            style={{ color: 'red' }} /> : null
                                                }
                                            </Card.ImgOverlay>
                                        </Card>
                                    </Col>
                                )
                            })

                            :

                            <Col md='3' key={`noWiki`}>
                                <Card className='bg-dark text-white'>
                                    <Card.Img src='images/test.jpg' alt='Card image' />
                                    <Card.ImgOverlay className='d-flex flex-column justify-content-center'>
                                        <Card.Title style={{alignSelf: 'center'}}>No Wikis</Card.Title>
                                    </Card.ImgOverlay>
                                </Card>
                            </Col>
                    }
                </CardDeck>
            </>
        );
    };
};