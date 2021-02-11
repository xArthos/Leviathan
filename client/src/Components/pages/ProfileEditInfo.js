// Modules
import React, { Component, useState } from 'react';
import { Jumbotron, Container, ListGroup, Row, Col, Image, Button, Nav, InputGroup, FormControl } from 'react-bootstrap';
import { Redirect, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import request from 'superagent';

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons';
// import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
// Icons
// import { faPlus } from '@fortawesome/free-solid-svg-icons';

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
                    Porcoddio
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

    let [editUsername, setEditUsername] = useState(false);
    let [editFirstName, setEditFirstName] = useState(false);
    let [editLastName, setEditLastName] = useState(false);

    let [editEmail, setEditEmail] = useState(false);
    let [editPassword, setEditPassword] = useState(false);

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


    ///////////////////////////////////////////////////////////////////////////////////////////
    // ! TO FINISH
    ///////////////////////////////////////////////////////////////////////////////////////////


    const changeEditMode = (key, sKey) => {
        if (!sKey) {
            switch (key) {
                case 'userName':
                    setEditUsername(editUsername = !editUsername);
                    break;

                default:
                    break;
            };
        } else {
            switch (sKey) {
                case 'firstName':
                    setEditFirstName(editFirstName = !editFirstName);
                    break;

                case 'lastName':
                    setEditLastName(editLastName = !editLastName);
                    break;

                default:
                    break;
            };
        };
    };

    const renderEditView = (fParam, sParam) => {

        let renderElement;
        if (sParam) {
            renderElement = <InputGroup.Text id={`${fParam}-${sParam}-field`}>{thisUser[fParam][sParam]}</InputGroup.Text>
        } else {
            renderElement = <InputGroup.Text id={`${fParam}-field`}>{thisUser[fParam]}</InputGroup.Text>
        };

        let placeholder;
        switch (fParam) {
            case 'userName':
                placeholder = 'Username'
                break;

            case 'email':
                placeholder = 'E-mail'
                break;

            case 'password':
                placeholder = 'Password'
                break;

            default:
                break;
        };

        switch (sParam) {
            case 'firstName':
                placeholder = 'First Name'
                break;

            case 'lastName':
                placeholder = 'Last Name'
                break;

            default:
                break;
        };

        return (
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    {renderElement}
                </InputGroup.Prepend>
                <FormControl
                    placeholder={`New ${placeholder}`}
                    aria-label={placeholder}
                    aria-describedby="basic-addon1"
                />
                <InputGroup.Append>
                    <Button variant='success' onClick={() => changeEditMode(fParam, sParam)}>Edit</Button>
                    <Button variant='danger' onClick={() => changeEditMode(fParam, sParam)}>Edit</Button>
                </InputGroup.Append>
            </InputGroup>
        );
    };

    const renderDefaultView = (fParam, sParam) => {

        let renderElement;
        if (sParam) {
            renderElement = thisUser[fParam][sParam]
        } else {
            renderElement = thisUser[fParam]
        };

        return (
            <>
                <Col md='8'>
                    {renderElement}
                </Col>
                <Col md='4' className='d-flex justify-content-end'>
                    <Button onClick={() => changeEditMode(fParam, sParam)}>Edit</Button>
                </Col>
            </>
        );
    };


    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////


    // Return the Component
    return (
        <Jumbotron fluid>
            <Container >
                <h2>Infos</h2>
                <Row>
                    <Col xs={6} md={6}>
                        <ListGroup>
                            <ListGroup.Item>
                                <Row>
                                    {
                                        !editUsername ?
                                            renderDefaultView('userName') :
                                            renderEditView('userName')
                                    }
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    {
                                        !editFirstName ?
                                            renderDefaultView('name', 'firstName') :
                                            renderEditView('name', 'firstName')
                                    }
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    {
                                        !editLastName ?
                                            renderDefaultView('name', 'lastName') :
                                            renderEditView('name', 'lastName')
                                    }
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col md='8'>
                                        {thisUser.type}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col md='8'>
                                        {`${date.getDate()} of ${months[date.getMonth()]} ${date.getFullYear()} - ${days[date.getDay()]} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                        </ListGroup>
                    </Col>
                    <Col xs={6} md={6}>
                        <ListGroup>
                            {
                                !editEmail ?
                                    <ListGroup.Item>
                                        <Button onClick={() => setEditEmail(editEmail = !editEmail)}>Change Password</Button>
                                    </ListGroup.Item>
                                    :
                                    <ListGroup.Item>
                                        <InputGroup className="mb-3">
                                            <FormControl
                                                placeholder='New E-mail'
                                                aria-label='E-mail'
                                                aria-describedby="basic-addon1"
                                            />
                                            <InputGroup.Append>
                                                <Button variant='success' onClick={() => setEditEmail(editEmail = !editEmail)}>Edit</Button>
                                                <Button variant='danger' onClick={() => setEditEmail(editEmail = !editEmail)}>Edit</Button>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </ListGroup.Item>
                            }
                            {
                                !editPassword ?
                                    <ListGroup.Item>
                                        <Button onClick={() => setEditPassword(editPassword = !editPassword)}>Change E-mail</Button>
                                    </ListGroup.Item>
                                    :
                                    <ListGroup.Item>
                                        <InputGroup className="mb-3">
                                            <FormControl
                                                placeholder='New Password'
                                                aria-label='Password'
                                                aria-describedby="basic-addon1"
                                            />
                                            <InputGroup.Append>
                                                <Button variant='success' onClick={() => setEditPassword(editPassword = !editPassword)}>Edit</Button>
                                                <Button variant='danger' onClick={() => setEditPassword(editPassword = !editPassword)}>Edit</Button>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </ListGroup.Item>
                            }
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </Jumbotron>
    );
};


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


export default class ProfileEditInfo extends Component {

    // Constructor
    constructor(props) {
        super(props);

        // Data of the logged User
        const loggedUser = JSON.parse(localStorage.getItem('Leviathan'));

        // Redirect to the login page if there is no User logged
        if (loggedUser === null) {
            // State
            this.state = {
                guest: true
            };
        } else {
            // State
            this.state = {
                user: loggedUser.user,
                accessToken: loggedUser.accessToken,
                refreshToken: loggedUser.refreshToken,
                render: 'About',
                guest: false,
                uploadedFile: null,
                uploadedFileUrl: '',
                uploadPreset: loggedUser.user._id,
                uploadUrl: 'http://localhost:8010/upload'
            };
        };
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

    // Request to the server
    requestHandler = (event, field, input) => {
        event.preventDefault();

        const newData = {
            [field]: input,
        };

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        axios.post(`http://localhost:8010/profile/:id/${field}`, newData, config)
            .then((result) => {

                console.log(result);

                console.log(`${result.request.status} ${result.request.statusText}`);

                switch (result.request.status) {
                    case 204:
                        this.setState({ message: 'User doesn\'t exist' });
                        break;

                    case 200:
                        this.setState(result.data.user);
                        if (this.state.message) {
                            delete this.state['message'];
                        }
                        this.props.history.push("/");
                        break;

                    default:
                        break;
                };
            })
            .catch((err) => {
                // err (message, config, code, request, response)
                console.log(err.response.data)

                switch (err.response.status) {

                    case 400:
                        this.setState({ message: err.response.data });
                        break;

                    case 409:
                        this.setState({ message: err.response.data });
                        break;

                    default:
                        break;
                };
            });
    };

    // Image Upload on the state
    onImageDrop(files) {
        this.setState({
            uploadedFile: files[0]
        });

        this.handleImageUpload(files[0]);
    };

    // Handeling the image update
    handleImageUpload(file) {
        let upload = request.post(this.state.uploadUrl)
            .field('userId', this.state.uploadPreset)
            .field('file', file);

        upload.end((err, res) => {
            if (err) {
                console.error(err);
            };

            if (res.body.secure_url !== '') {
                this.setState({
                    uploadedFileUrl: res.body.secure_url
                });
            };
        });
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

                                    <Dropzone
                                        onDrop={this.onImageDrop.bind(this)}
                                        accept="image/*"
                                        multiple={false}>
                                        {({ getRootProps, getInputProps }) => {
                                            return (
                                                <div
                                                    {...getRootProps()}
                                                >
                                                    <input {...getInputProps()} />
                                                    {
                                                        <p>Try dropping some files here, or click to select files to upload.</p>
                                                    }
                                                </div>
                                            )
                                        }}
                                    </Dropzone>

                                    <div>
                                        {this.state.uploadedFileUrl === '' ? null :
                                            <div>
                                                <p>{this.state.uploadedFile.name}</p>
                                                <img src={this.state.uploadedFileUrl} alt='coddio' />
                                            </div>}
                                    </div>

                                </Col>
                                <Col md={4}>
                                    <h1>{this.props.match.params.userName}</h1>
                                </Col>
                                <Col md={4}>
                                    <Button>Edit Infos</Button>
                                </Col>
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