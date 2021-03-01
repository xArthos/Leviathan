// Modules
import { Component } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';



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
                <Form onSubmit={this.loginRequest} className='header'>
                    {this.state.message ?
                        <Alert variant='danger'>
                            {this.state.message}
                        </Alert> :
                        null
                    }
                    <Form.Group controlId='email'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type='email' placeholder='Enter email' name='email' />
                        <Form.Text className='text-muted'>
                            We'll never share your email with anyone else.
                    </Form.Text>
                    </Form.Group>

                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder='Password' name='password' />
                    </Form.Group>

                    <Button variant='primary' type='submit'>
                        Submit
                    </Button>
                </Form>
            </>
        );
    };
};