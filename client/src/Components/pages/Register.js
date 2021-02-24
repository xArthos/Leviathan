// Modules
import { Component } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


// Main Component
export default class LogUser extends Component {

    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            firstName: '',
            lastName: '',
            email: '',
            confirmEmail: '',
            password: '',
            passwordConfirmation: '',
            profilePicture: ''
        };

        this.requestHandler = this.requestHandler.bind(this);
        this.confirmReset = this.confirmReset.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.inputFileChange = this.inputFileChange.bind(this);
        this.eraseAlert = this.eraseAlert.bind(this);
    };





    ///////////////////////////////////////////////////////////////////////////////////////////
    //? ************************ # FUNCTIONS


    //? *************************** # Handlers # **************************************
    // Handle the data sent by the user
    inputChange(event) {

        // Take the input field
        const target = event.target;

        // Set type of value in case of checkbox
        const value = target.type === 'checkbox' ? target.checked : target.value;

        // Take the name from the input field
        const name = target.name;

        // Assign the values from the form in the state
        this.setState({
            [name]: value
        });
    };

    // Handle the file uploaded by the user
    inputFileChange = (event) => {

        // Take the input field
        const target = event.target;

        // Take the name from the input field
        const name = target.name;

        // Take the file from the input field
        const file = target.files[0];

        // Assign the file from the form in the state
        this.setState({
            [name]: file
        })
    };

    // Request to the server
    requestHandler = (event) => {
        event.preventDefault();

        console.log(this.state);
        // console.log(event.target.email.value);
        const newUser = {
            userName: this.state.userName,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            confirmEmail: this.state.confirmEmail,
            password: this.state.password,
            passwordConfirmation: this.state.passwordConfirmation
        };

        const formData = new FormData();
        formData.append('profilePicture', this.state.profilePicture);
        formData.append('body', JSON.stringify(newUser));
        console.log(formData.entries());

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        axios.post('http://localhost:8010/register', formData, config)
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
    //? *******************************************************************************



    //? ******************** # Buttons Scripts # **************************************
    // ! INCOMPLETE
    confirmReset = (event) => {
        // event.preventDefault()
        console.log(this.state)
        this.form.reset()
    };

    // Erase the alert message
    eraseAlert = (event) => {
        this.setState({
            message: null
        });
    };
    //? *******************************************************************************


    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////





    // Render
    render() {
        return (
            <>
                {   this.state.message ?
                    <Alert variant='danger' onClick={this.eraseAlert} dismissible>
                        {/* <div dangerouslySetInnerHTML={{ __html: this.state.message }} /> */}
                        {this.state.message}
                    </Alert> :
                    null
                }

                <Form
                    autoComplete='on'
                    onSubmit={this.requestHandler}
                    onReset={this.confirmReset}
                    ref={form => this.form = form}
                >

                    {/* Username */}
                    <Row>
                        <Col md='6'>
                            <Form.Group controlId='userName'>
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Write your username'
                                    name='userName'
                                    value={this.state.userName}
                                    required
                                    onChange={this.inputChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Personal Data */}
                    <Row>
                        {/* First Name */}
                        <Col md='6'>
                            <Form.Group controlId='firstName'>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Write your First Name'
                                    name='firstName'
                                    value={this.state.firstName}
                                    required
                                    onChange={this.inputChange} />
                            </Form.Group>
                        </Col>

                        {/* Last Nime */}
                        <Col md='6'>
                            <Form.Group controlId='lastName'>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Write your Last Name'
                                    name='lastName'
                                    value={this.state.lastName}
                                    required
                                    onChange={this.inputChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* E-mail Data */}
                    <Row>
                        <Col md='6'>
                            <Form.Group controlId='email'>
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='example@mail.com'
                                    name='email'
                                    value={this.state.email}
                                    required
                                    onChange={this.inputChange} />
                            </Form.Group>
                        </Col>

                        <Col md='6'>
                            <Form.Group controlId='confirmEmail'>
                                <Form.Label>Confirm E-mail</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='example@mail.com'
                                    name='confirmEmail'
                                    value={this.state.confirmEmail}
                                    required
                                    onChange={this.inputChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Profile Picture */}
                    <Row>
                        <Col md='6'>
                            <Form.File controlId='profilePicture'>
                                <Form.File.Label>Profile Picture</Form.File.Label>
                                <Form.File.Input
                                    name='profilePicture'
                                    onChange={this.inputFileChange} />
                            </Form.File>
                        </Col>
                    </Row>

                    {/* Password Data */}
                    <Row>
                        {/* Password */}
                        <Col md='6'>
                            <Form.Group controlId='password'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type='password'
                                    placeholder='Write your password'
                                    name='password'
                                    value={this.state.password}
                                    required
                                    onChange={this.inputChange} />
                            </Form.Group>
                        </Col>

                        {/* Confirm Password */}
                        <Col md='6'>
                            <Form.Group controlId='passwordConfirmation'>
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type='password'
                                    placeholder='Re-type your password'
                                    name='passwordConfirmation'
                                    value={this.state.passwordConfirmation}
                                    required
                                    onChange={this.inputChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md='1'>
                            <Button variant='primary' type='submit'>
                                Submit
                            </Button>
                        </Col>
                        <Col md='1'>
                            <Button variant='danger' type='reset'>
                                Reset
                            </Button>
                        </Col>
                    </Row>

                </Form>
            </>
        );
    };
};