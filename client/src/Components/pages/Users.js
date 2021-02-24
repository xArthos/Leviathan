// Modules
import React from "react";
import { useSelector } from 'react-redux';
import { Table, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons';
// Icons
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faUsersCog } from '@fortawesome/free-solid-svg-icons';
import { faAt } from '@fortawesome/free-solid-svg-icons';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';

// Fontawesome Library
library.add(faStroopwafel);


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


// Main Component
const Users = () => {

    // Take the users from the Redux-Instance
    const user = useSelector((state) => state.users);
    // console.log(user);

    // Number of Registered User
    const count = user.filter(user => user).length;

    // Component Return
    return (
        <Container>
            <h1>Users: {count}</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th><FontAwesomeIcon icon={faUserCircle}></FontAwesomeIcon> ID</th>
                        <th><FontAwesomeIcon icon={faUsersCog}></FontAwesomeIcon> Type</th>
                        <th><FontAwesomeIcon icon={faShieldAlt}></FontAwesomeIcon> Verified</th>
                        <th><FontAwesomeIcon icon={faAt}></FontAwesomeIcon> E-Mail</th>
                        <th><FontAwesomeIcon icon={faAddressCard}></FontAwesomeIcon> Name</th>
                    </tr>
                </thead>
                <tbody key={"tbody"}>
                    {user.map((user) => {
                        let verified;

                        if (user.active) {
                            verified = <FontAwesomeIcon icon={faCheck} style={{ color: "green" }}></FontAwesomeIcon>
                        } else {
                            verified = <FontAwesomeIcon icon={faTimes} style={{ color: "red" }}></FontAwesomeIcon>
                        }

                        return <tr key={user._id}>
                            <td>{user._id}</td>
                            <td><Link to={`/profile:${user.userName}`}>{user.userName}</Link></td>
                            <td>{user.type}</td>
                            <td>{verified}</td>
                            <td>{user.email}</td>
                            <td>{user.name.lastName} {user.name.firstName}</td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </Container>
    );
};

export default Users;