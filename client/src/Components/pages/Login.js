import { Component } from 'react';
import axios from 'axios';

export default class LogUser extends Component {
    submitName = (event) => {
        event.preventDefault();
        console.log(event.target.email.value)
        const user = {
            email: event.target.email.value,
            password: event.target.password.value
        };
        axios.post('http://localhost:8010/user/login', user)
            .then(() => console.log('User is Logged'))
    };

    render() {
        return (
            <div>
                <form onSubmit={this.submitName} method="POST" class="px-4 py-3" autocomplete="on">
                    <div class="form-group">
                        <label for="email">Email address</label>
                        <input type="email" class="form-control" name="email" placeholder="email@example.com" />
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" name="password" placeholder="Password" />
                    </div>
                    <div class="form-group">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" name="check" />
                            <label class="form-check-label" for="check">Remember me</label>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Sign in</button>
                </form>

                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="/user/signUp">New around here? Sign up</a>
                <a class="dropdown-item" href="/user">Forgot password?</a>
            </div>
        );
    };
};