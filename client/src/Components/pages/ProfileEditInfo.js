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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons';

// Icons
import { faPen } from '@fortawesome/free-solid-svg-icons';

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

        // Logged User
        const loggedUser = JSON.parse(localStorage.getItem('Leviathan'));

        //* State
        // Set the State if there's not a User logged
        if (loggedUser === null) {
            this.state = {
                isLogged: false
            };
        } else {
            this.state = {

                // Logged User
                isLogged: true,

                // User's Infos
                user: loggedUser.user,
                profilePicture: loggedUser.user.profilePicture,
                accessToken: loggedUser.accessToken,
                refreshToken: loggedUser.refreshToken,

                // Render by Default the sub-component 'About'
                render: 'About',

                //Edit-Mode
                editProfilePicMode: false,

                //Image Upload Settings
                uploadUrl: 'http://localhost:8010/upload',
                imageUploaded: '',
                uploadedFile: null,
                uploadPreset: {
                    userId: loggedUser.user._id,
                    userName: loggedUser.user.userName
                }

            };
        };

        // Binding functions
        this.changeEditMode = this.changeEditMode.bind(this);
        this.takeUserProfilePic = this.takeUserProfilePic.bind(this);
    };





    ///////////////////////////////////////////////////////////////////////////////////////////
    //? ************************ # FUNCTIONS





    //? ******************** # SUB-COMPONENTS # **************************************
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
    //? ****************************************************************************





    //? ******************** # IMAGE UPLOAD # **************************************
    // Upload and set the image in the state
    onImageDrop(files) {
        this.setState({
            uploadedFile: files[0]
        });

        this.handleImageUpload(this.state.uploadedFile);
    };

    // Handeling the image update
    handleImageUpload(file) {
        let upload = request.post(this.state.uploadUrl)
            .field(this.state.uploadPreset)
            .field('editProfilePicture', file);

        upload.end((err, res) => {
            if (err) {
                console.error(err);
            };

            if (res.body.imageUploaded !== '') {
                this.takeUserProfilePic();
                this.setState({
                    imageUploaded: res.body.imageUploaded
                });
            };
        });
    };
    //? ****************************************************************************





    //? ******************** # IMAGE DOWNLOAD # **************************************
    // Download the Profile Picture
    takeUserProfilePic() {
        let userName;

        if (this.state.user.userName) {
            userName = this.state.user.userName;
        } else {
            userName = this.match.props.params.userName;
        }
        return axios.get(`http://localhost:8010/${userName}/profilePicture`)
            .then((res) => this.setState({ profilePicture: res.data }))
            .catch(err => console.log(err))
    };

    // Load the profile picture when the component is loaded
    componentDidMount() {
        this.takeUserProfilePic();
    };
    //? ****************************************************************************





    //? ******************** Editing-Mode **************************************
    // Enable/Disable Editing profile Picture
    changeEditMode = () => {
        if (this.state.editProfilePicMode === false) {
            this.setState({
                editProfilePicMode: true
            });
        } else if (this.state.editProfilePicMode === true) {
            this.setState({
                editProfilePicMode: false
            });
        };
    };

    // Edit View Profile Picture
    renderEditView = () => {

        let renderElement = (
            <>
                <Dropzone
                    onDrop={this.onImageDrop.bind(this)}
                    accept='image/*'
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

                {
                    this.state.imageUploaded === '' ? null :
                        <div>
                            <p>{this.state.uploadedFile.name}</p>
                            <img src={this.state.imageUploaded} alt='coddio' />
                        </div>
                }
            </>
        )

        return (
            <>

                <div>
                    <Image src={`${this.state.profilePicture}`} thumbnail />

                    <Button className='position-absolute top-right btn btn-warning' onClick={() => this.changeEditMode()}><FontAwesomeIcon icon={faPen} style={{ color: 'red' }} /></Button>

                </div>

                {renderElement}

            </>
        );
    };

    // Default View Profile Picture
    renderDefaultView = () => {

        let renderElement = (
            <div>
                <Image src={`${this.state.profilePicture}`} thumbnail />
                <Button
                    className='position-absolute top-right btn btn-warning'
                    onClick={() => this.changeEditMode()}>
                    <FontAwesomeIcon icon={faPen} style={{ color: 'red' }} />
                </Button>
            </div>
        );

        return (
            <>
                {renderElement}
            </>
        );
    };
    //? ****************************************************************************





    ///////////////////////////////////////////////////////////////////////////////////////////





    // Render
    render() {

        if (!this.state.isLogged) {
            return <Redirect to={{
                pathname: '/unauthorized',
                state: { message: 'Unauthorized' }
            }} />
        }

        else {
            return (
                <>
                    {/* Title, Profile Picture, Edit Button */}
                    <Jumbotron fluid>
                        <Container >
                            <Row>

                                <Col md={4}>
                                    {this.state.editProfilePicMode === true ?
                                        this.renderDefaultView()
                                        :
                                        this.renderEditView()
                                    }
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
                                    this.state.isLogged ?
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