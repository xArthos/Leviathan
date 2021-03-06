// Modules
import React, { useState, useEffect } from "react";
import { Table, Container, Jumbotron } from 'react-bootstrap';
import { Link } from "react-router-dom";
import axios from 'axios';

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons';
// Icons
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

// Fontawesome Library
library.add(faStroopwafel);


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


// Main Component
const Wikis = () => {

    // Set URL
    const wikisUrl = 'http://localhost:8010/allWikisList';
    let [wikis, setWikis] = useState([]);

    // Call once the user from the DB
    useEffect(() => {
        axios.get(wikisUrl)
            .then((res) => {
                // eslint-disable-next-line
                setWikis(wikis = res.data)
            })
            .catch((err) => console.log(err));
    }, []);

    // Component Return
    return (
        <>
            <Jumbotron fluid className='header' />
            <Container className='header'>
                <h1>Wikis: </h1>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th><FontAwesomeIcon icon={faUserCircle}></FontAwesomeIcon> ID</th>
                            <th><FontAwesomeIcon icon={faAddressCard}></FontAwesomeIcon> Name</th>
                        </tr>
                    </thead>
                    <tbody key={"tbody"}>
                        {wikis.map((wikis) => {

                            return <tr key={wikis._id}>
                                <td>{wikis._id}</td>
                                <td><Link to={`/wiki/${wikis._id}`}>Wiki</Link></td>
                            </tr>
                        })}
                    </tbody>
                </Table>
            </Container>
        </>
    );
};

export default Wikis;