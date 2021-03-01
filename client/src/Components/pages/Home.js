// Modules
import React, { Component } from 'react';
import { Jumbotron, Row, Col, Card, ListGroup, ListGroupItem, CardGroup, Image } from 'react-bootstrap';
import Moment from 'react-moment';
import axios from 'axios';


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


// Main Component
export default class Main extends Component {
    constructor(props) {
        super(props);

        //* State
        this.state = {
            lastPublishedUrl: 'http://localhost:8010/lastPublishedWikis',

            lastPublishedPages: []
        };
    };

    componentDidMount() {
        axios.get(this.state.lastPublishedUrl)
            .then((res) => {
                console.log(res.data);
                this.setState({
                    lastPublishedPages: res.data
                });
            })
            .catch(err => console.log(err));
    };

    // Render
    render() {
        return (
            <>
                <Jumbotron fluid className='header'>
                    <Row className='mw-100 m-auto'>
                        <Col md={8} className='d-flex flex-column justify-content-center'>
                            <Image src='/images/leviatahan_logo.png' className='mw-100' />
                        </Col>

                        <Col md={2} className='d-flex flex-column justify-content-around'>
                            <div><Image src='/images/explore.png' className='mw-100' /></div>
                            <div><Image src='/images/create.png' className='mw-100' /></div>
                            <div><Image src='/images/share.png' className='mw-100' /></div>
                        </Col>

                        <Col md={2} className='d-flex flex-column justify-content-around'>
                            <div><h3>Explore</h3></div>
                            <div><h3>Create</h3></div>
                            <div><h3>Share</h3></div>
                        </Col>
                    </Row>
                </Jumbotron>

                <Row className='mw-100 mx-auto mb-5' id='mainHome'>
                    <Col md={2} className='d-flex flex-column justify-content-between'>
                        <div>
                            <h2 className='topTitle'>Top Serie</h2>
                            <ListGroup className='mb-3'>
                                <ListGroupItem><a href='/#mainHome'>Cras justo odio</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>Dapibus ac facilisis in</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>Morbi leo risus</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>Porta ac consectetur ac</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>Vestibulum at eros</a></ListGroupItem>
                            </ListGroup>
                        </div>
                        <div>
                            <h2 className='topTitle'>Top Games</h2>
                            <ListGroup className='mb-3'>
                                <ListGroupItem><a href='/#mainHome'>Cras justo odio</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>Dapibus ac facilisis in</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>Morbi leo risus</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>Porta ac consectetur ac</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>Vestibulum at eros</a></ListGroupItem>
                            </ListGroup>
                        </div>
                        <div>
                            <h2 className='topTitle'>Top Guides</h2>
                            <ListGroup>
                                <ListGroupItem><a href='/#mainHome'>Cras justo odio</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>Dapibus ac facilisis in</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>Morbi leo risus</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>Porta ac consectetur ac</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>Vestibulum at eros</a></ListGroupItem>
                            </ListGroup>
                        </div>
                    </Col>

                    <Col md={7} className='d-flex flex-column justify-content-center'>
                        <Card>
                            <Card.Img variant="top" className='w-100' src="images/test.jpg" />
                            <Card.Body>
                                <Card.Title><a href='/#mainHome'>PS4 Firmware Update 8.03</a></Card.Title>
                                <Card.Text className='text-white'>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                            </Card.Text>
                            </Card.Body>
                            <Card.Body>
                                <Card.Link href="#">Card Link</Card.Link>
                                <Card.Link href="#">Another Link</Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={3} className='d-flex flex-column justify-content-between'>
                        <h2 className='topTitle'>Last Updates</h2>
                        {
                            this.state.lastPublishedPages.map((item) => {
                                return (
                                    <Card key={item._id} className='bg-dark text-white'>
                                        <Card.Img src={`http://localhost:8010/img/bg/${item._id}/${item.cardBg.originalname.split('.')[1]}`} alt='Card image' />
                                        <Card.ImgOverlay className='d-flex flex-column align-items-center justify-content-between'>
                                            <Card.Title><a href={`/wiki/${item._id}`}>{item.title}</a></Card.Title>
                                            <Card.Text>
                                                <Moment fromNow>{item.createdAt}</Moment>
                                            </Card.Text>
                                        </Card.ImgOverlay>
                                    </Card>
                                )
                            })
                        }
                    </Col>
                </Row>

                <h2 className='topTitle'>Gallery</h2>
                <CardGroup>
                    <Card className='bg-dark text-white'>
                        <Card.Img src='images/test.jpg' alt='Card image' />
                        <Card.ImgOverlay className='d-flex flex-column align-items-center justify-content-between'>
                            <Card.Title><a href='/#mainHome'>Title</a></Card.Title>
                            <Card.Text>
                                Posted by <a href='/#'>Author</a>
                            </Card.Text>
                        </Card.ImgOverlay>
                    </Card>
                    <Card className='bg-dark text-white'>
                        <Card.Img src='images/test.jpg' alt='Card image' />
                        <Card.ImgOverlay className='d-flex flex-column align-items-center justify-content-between'>
                            <Card.Title><a href='/#mainHome'>Title</a></Card.Title>
                            <Card.Text>
                                Posted by <a href='/#'>Author</a>
                            </Card.Text>
                        </Card.ImgOverlay>
                    </Card>
                    <Card className='bg-dark text-white'>
                        <Card.Img src='images/test.jpg' alt='Card image' />
                        <Card.ImgOverlay className='d-flex flex-column align-items-center justify-content-between'>
                            <Card.Title><a href='/#mainHome'>Title</a></Card.Title>
                            <Card.Text>
                                Poster by <a href='/#'>Author</a>
                            </Card.Text>
                        </Card.ImgOverlay>
                    </Card>
                </CardGroup>
            </>
        );
    };
};