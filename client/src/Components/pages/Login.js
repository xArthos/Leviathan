// Modules
import { Component } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Jumbotron, Image } from 'react-bootstrap';



///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////



// Main Component
export default class Login extends Component {

    constructor(props) {
        super(props);

        // * State
        this.state = {
            isLogged: false
        };

        this.loginRequest = this.loginRequest.bind(this);
    };


    //? ******************** # REQUEST HANDLER # **************************************
    loginRequest = (event) => {
        event.preventDefault();
        // console.log(event.target.email.value);

        // User's Input
        const user = {
            email: event.target.email.value,
            password: event.target.password.value
        };

        // Sever Request
        axios.post('http://localhost:8010/login', user)
            .then((result) => {

                console.log(result.request.status, result.request.statusText);

                switch (result.request.status) {
                    case 204:
                        this.setState({ message: 'User doesn\'t exist' });
                        break;

                    case 200:
                        console.log(result.data);
                        if (this.state.message) {
                            delete this.state['message'];
                        };

                        localStorage.setItem('Leviathan', JSON.stringify(result.data));

                        this.props.history.push({
                            pathname: '/success',
                            state: {
                                message: 'Loged In succesufully'
                            }
                        });
                        break;

                    default:
                        break;
                };
            })
            .catch((err) => {
                // err (message, config, code, request, response)
                console.log(err)
                switch (err.response.status) {

                    case 403:
                        this.setState({ message: 'Wrong password' });
                        break;

                    case 406:
                        this.setState({ message: err.response.request.responseText });
                        break;

                    case 561:
                        this.setState({ message: 'This Account is not yet verified' });
                        break;

                    default:
                        break;
                };
            });
    };
    //? **************************************************************************


    // Render
    render() {
        return (
            <>
                <Jumbotron fluid className='header' />
                <div id='loginPanel' className='my-5 mx-auto'>
                    <div id='loginFormContainer'>
                        <div className='text-center mt-5'>
                            <Image src="/images/leviatahan_logo_s.png" className="d-inline-block" alt="Leviathan logo" />
                            <h1 className='my-3'>Welcome to Leviathan!</h1>
                        </div>

                        <Form onSubmit={this.loginRequest} className='p-3 text-center'>
                            <Form.Group className='mt-2' controlId='email'>
                                <Form.Control type='email' placeholder='Enter email' name='email' />
                            </Form.Group>

                            <Form.Group className='mt-5' controlId='password'>
                                <Form.Control type='password' placeholder='Password' name='password' />
                            </Form.Group>

                            <Button variant='warning' type='submit' className='mt-2'>
                                Submit
                            </Button>
                        </Form>

                        {this.state.message ?
                            <Alert variant='danger' className='m-5'>
                                {this.state.message}
                            </Alert> :
                            null
                        }
                    </div>
                    <Image className='w-100' src="images/login-bg.jpg" />
                </div>
            </>
        );
    };
};