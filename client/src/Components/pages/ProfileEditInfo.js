// Modules
import React, { Component, useState } from 'react';
import { Jumbotron, Container, ListGroup, Row, Col, Image, Button, Nav, InputGroup, FormControl, Alert, Form } from 'react-bootstrap';
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

// Fontawesome Library
library.add(faStroopwafel);




///////////////////////////////////////////////////////////////////////////////////////////
//? ************************ # SUB-COMPONENTS
// ! TO FINISH

// Sub Components
const About = (props) => {

    // * useState
    let [input, setInput] = useState();
    let [typingTimer, setTypingTimer] = useState(null);
    let [successMessage, setSuccessMessage] = useState(null);
    let [failMessage, setFailMessage] = useState(null);

    // URL request
    const aboutUpdateUrl = `http://localhost:8010/profile:${props.user.userName}/edit/about`;

    // Set the value and timer before sending a request on server
    const handleOnKeyUpRequest = (event) => {
        setInput(input = event.target.value);

        clearTimeout(typingTimer);
        if (input) {
            setTypingTimer(typingTimer = setTimeout(doneTyping, 1000));
        };

        const data = {
            data: input,
            user: props.user
        };

        // Send changements to server when user finishes to type
        function doneTyping() {
            console.log(data)
            axios.post(aboutUpdateUrl, data)
                .then((res) => {
                    setSuccessMessage(successMessage = res.data.message);
                    localStorage.setItem('Leviathan', JSON.stringify(res.data.userUpdated));

                    const { user, accessToken, refreshToken } = res.data.userUpdated;
                    props.handler(user, accessToken, refreshToken);
                })
                .catch((err) => { setFailMessage(failMessage = err.data.message) });
        };
    };

    // Reset the timer after user stopped tyiping
    const handleOnKeyDownRequest = () => {
        // setInput(input = event.target.value);
        clearTimeout(typingTimer);
    };

    // Component Return
    return (
        <Jumbotron fluid className='profileDisplayPanel'>
            <Container>
                <div className='d-flex justify-content-between'>
                    <h2>About</h2>
                    {
                        successMessage !== null ?
                            <Alert variant='success' className='m-0'>
                                {successMessage}
                            </Alert> :
                            null
                    }
                    {
                        failMessage !== null ?
                            <Alert variant='danger' className='m-0'>
                                {failMessage}
                            </Alert> :
                            null
                    }
                </div>

                <hr />

                <Form.Control
                    name='about'
                    as="textarea"
                    rows={20}
                    maxLength={600}
                    defaultValue={props.user.about}
                    onKeyUp={handleOnKeyUpRequest}
                    onKeyDown={handleOnKeyDownRequest} />
            </Container>
        </Jumbotron>
    );
};

const Messages = () => {

    // Component Return
    return (
        <Jumbotron fluid className='profileDisplayPanel'>
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
        <Jumbotron fluid className='profileDisplayPanel'>
            <Container >
                <h2>Test</h2>
                <hr />
            </Container>
        </Jumbotron>
    );
};

const PersonalArea = () => {

    // * useState
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
    //? ************************ # FUNCTIONS
    // ! TO FINISH

    // Edit-Mode Handler
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

    // Edit Element Rendering
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

    // Defuault Element Rendering
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
                    <Button variant='warning' onClick={() => changeEditMode(fParam, sParam)}>Edit</Button>
                </Col>
            </>
        );
    };


    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////


    // Component Return
    return (
        <Jumbotron fluid className='profileDisplayPanel'>
            <Container >
                <h2>Infos</h2>
                <hr />
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




// Main Component
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
                profilePicture: loggedUser.user.profilePicture.replace(/"/g, ''),
                accessToken: loggedUser.accessToken,
                refreshToken: loggedUser.refreshToken,

                // Render by Default the sub-component 'About'
                render: 'About',

                //Edit-Mode
                editProfilePicMode: false,

                //Image Upload Settings
                uploadUrl: `http://localhost:8010/profile:${loggedUser.user.userName}/edit/newProfilePicupload`,
                confirmUrl: 'http://localhost:8010/confirm',
                imageUploadedUrl: '',
                imageHash: '',
                uploadedFile: null,
                uploadPreset: {
                    userId: loggedUser.user._id,
                    userName: loggedUser.user.userName
                },

                // Alert Message
                profileUpdatedMsg: ''
            };
        };

        // Binding functions
        this.changeEditMode = this.changeEditMode.bind(this);
        this.confirmUpdateImage = this.confirmUpdateImage.bind(this);
        this.handler = this.handler.bind(this);
    };





    ///////////////////////////////////////////////////////////////////////////////////////////
    //? ************************ # FUNCTIONS

    handler = (resUser, resAccessToken, resRefreshToken) => {
        this.setState({
            user: resUser,
            accessToken: resAccessToken,
            refreshToken: resRefreshToken
        });
    };



    //? ******************** # Sub-Component # **************************************
    // Take and set the name of the Sub-Component to render
    handleClick(component) {
        // console.log(component);
        this.setState({ render: component });
    };

    // Render the Component selected
    _renderSubComp() {
        switch (this.state.render) {
            case 'About': return <About handler={this.handler} user={this.state.user} />
            case 'Messages': return <Messages />
            case 'Favorite': return <Favorite />
            case 'PersonalArea': return <PersonalArea />
            default: return <About />
        };
    };
    //? ****************************************************************************



    //? ******************** # Image Upload # **************************************
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
                this.setState({
                    imageUploadedUrl: res.body.imageUploadedUrl,
                    imageHash: Date.now()
                });
            };
        });
    };

    // Confirm the update of the image
    confirmUpdateImage() {
        axios.post(this.state.confirmUrl, this.state.uploadPreset)
            .then(res => {
                this.changeEditMode();
                this.setState({
                    profileUpdatedMsg: res.data.message,
                    imageUploadedUrl: ''
                });
                setTimeout(() => {
                    window.location.reload(true);
                }, 2500);
            })
            .catch((err) => console.log(err))
    };
    //? ****************************************************************************



    //? ******************** # Editing-Mode # **************************************
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

        // Drag and Drop Element
        const editElement = (
            <>
                <Col md='9' className='d-flex flex-column justify-content-between'>
                    <Dropzone
                        onDrop={this.onImageDrop.bind(this)}
                        accept='image/*'
                        multiple={false}>
                        {({ getRootProps, getInputProps }) => {
                            return (
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    {
                                        <div id='droppingArea'>Drop your image here, or click to select one to upload.</div>
                                    }
                                </div>
                            )
                        }}
                    </Dropzone>

                    <div>
                        {
                            this.state.imageUploadedUrl === '' ?
                                <>
                                    <Button disabled variant='warning' onClick={() => this.confirmUpdateImage()} >Update</Button>{' '}
                                    <Button variant='danger' onClick={() => this.changeEditMode()}>Cancel</Button>
                                </>
                                :
                                <>
                                    <Button variant='warning' onClick={() => this.confirmUpdateImage()} >Update</Button>{' '}
                                    <Button variant='danger' onClick={() => this.changeEditMode()}>Cancel</Button>
                                </>
                        }
                    </div>

                </Col>

                {
                    this.state.imageUploadedUrl === '' ?
                        <Col md='3'>
                            <div className='square-dotted-box' />
                        </Col>
                        :
                        <Col md='3'>
                            <Image src={`${this.state.imageUploadedUrl}?${this.state.imageHash}`} alt='Profile Image to Upload' thumbnail />
                        </Col>
                }
            </>
        )

        // Return of the function
        return (
            <>
                <Row className='px-3 mx-0'>
                    {/* Profile Picture */}
                    <Col md='3'>
                        <div className='mw-content m-auto'>
                            <Image src={this.state.profilePicture} thumbnail />
                        </div>
                    </Col>

                    {/* User's Name */}
                    <Col md={7}>
                        <h1>{this.props.match.params.userName}</h1>
                    </Col>

                    {/* Close Edit-page Button */}
                    <Col md={2}>
                        <Button variant='warning' onClick={() => this.props.history.push(`/profile:${this.state.user.userName}`)}>Close Edit Page</Button>
                    </Col>
                </Row>

                <Container>
                    <h2 className='mt-3'>Upload New Profile Picture</h2>
                    <hr className='mb-3' />

                    <Row>
                        {editElement}
                    </Row>
                </Container>
            </>
        );
    };

    // Default View Profile Picture
    renderDefaultView = () => {

        const renderElement = (
            <>
                <Row className='px-3 mx-0'>
                    {/* Profile Picture and Edit function */}
                    <Col md='3'>
                        <div className='mw-content m-auto'>
                            <Image src={this.state.profilePicture} thumbnail />
                            <Button
                                variant='warning'
                                className='position-absolute top-right'
                                onClick={() => this.changeEditMode()}>
                                <FontAwesomeIcon icon={faPen} style={{ color: 'red' }} />
                            </Button>
                        </div>


                        {this.state.profileUpdatedMsg ?
                            <Alert variant='success'>
                                {this.state.profileUpdatedMsg}
                            </Alert> :
                            null
                        }
                    </Col>

                    {/* User's Name */}
                    <Col md={7}>
                        <h1>{this.props.match.params.userName}</h1>
                    </Col>

                    {/* Close Edit-page Button */}
                    <Col md={2}>
                        <Button variant='warning' onClick={() => this.props.history.push(`/profile:${this.state.user.userName}`)}>Close Edit Page</Button>
                    </Col>
                </Row>
            </>
        );

        return (
            <>
                {renderElement}
            </>
        );
    };
    //? ****************************************************************************



    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////





    // Render
    render() {

        if (!this.state.isLogged) {
            return <Redirect to={{
                pathname: '/unauthorized',
                state: { message: 'Unauthorized' }
            }} />
        }

        return (
            <>
                {/* Title, Profile Picture, Edit Button */}
                <Jumbotron fluid className='header'>
                    {!this.state.editProfilePicMode ?
                        this.renderDefaultView()
                        :
                        this.renderEditView()
                    }
                </Jumbotron>

                <div id='mainContainer'>
                    {/* Sub-Component Nav Tab */}
                    <Nav justify variant="tabs">
                        {
                            this.state.render === 'About' ?
                                <Nav.Item>
                                    <Nav.Link eventKey="about" onClick={this.handleClick.bind(this, 'About')} active>About</Nav.Link>
                                </Nav.Item>
                                :
                                <Nav.Item>
                                    <Nav.Link eventKey="about" onClick={this.handleClick.bind(this, 'About')}>About</Nav.Link>
                                </Nav.Item>
                        }
                        <Nav.Item>
                            <Nav.Link eventKey="messages" onClick={this.handleClick.bind(this, 'Messages')}>Messages</Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="favourite" onClick={this.handleClick.bind(this, 'Favorite')}>Favorite</Nav.Link>
                        </Nav.Item>
                        {
                            this.state.isLogged ?
                                <Nav.Item>
                                    <Nav.Link eventKey="private" onClick={this.handleClick.bind(this, 'PersonalArea')}>Personal Area</Nav.Link>
                                </Nav.Item> : null
                        }
                    </Nav>

                    {/* Sub-Component Render */}
                    {this._renderSubComp()}
                </div>
            </>
        );
    };
};