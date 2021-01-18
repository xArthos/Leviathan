import { Component } from "react";
import axios from "axios";

export default class CreateUser extends Component {
    constructor() {
        super();
    }
    submitName = (event)=> {
        event.preventDefault();
        console.log(event.target.username.value)
        const user = {
            username: event.target.username.value
        };
        axios.post('http://localhost:5000/users/add', user)
        .then(()=> console.log('User is created'))
    }
    render() {
        return(
            <form onSubmit={this.submitName}>
                <label>User Name:</label>
                <input type="text" className="form-control" name="username"/>
                <button type="submit">Create</button>
            </form>
        )
    }
}