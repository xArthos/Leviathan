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
            topGalleryUrl: 'http://localhost:8010/lastPublishedGalleries',

            lastPublishedPages: [],
            topGallery: [],
        };
    };

    componentDidMount() {
        axios.get(this.state.lastPublishedUrl)
            .then((res) => {
                this.setState({
                    lastPublishedPages: res.data
                });
            })
            .catch(err => console.log(err));

            axios.get(this.state.topGalleryUrl)
            .then((res) => {
                this.setState({
                    topGallery: res.data
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
                        <div className='rank-container p-2 rounded mb-3'>
                            <h2 className='topTitle'>Top Serie</h2>
                            <ListGroup className='mb-3'>
                                <ListGroupItem><a href='/#mainHome'>Battlefield</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>The Elder Scrolls</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>The Witcher</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>Cyberpunk</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>Resident Evil</a></ListGroupItem>
                            </ListGroup>
                        </div>
                        <div className='rank-container p-2 rounded mb-3'>
                            <h2 className='topTitle'>Top Games</h2>
                            <ListGroup className='mb-3'>
                                <ListGroupItem><a href='/#mainHome'>Cyberpunk 2077</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>The Witcher 3: wild Hunt</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>The Elder Scrolls: Online</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>League Of Legends</a></ListGroupItem>
                                <ListGroupItem><a href='/#mainHome'>Overwatch</a></ListGroupItem>
                            </ListGroup>
                        </div>
                        <div className='rank-container p-2 rounded'>
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

                    <Col md={7} className='d-flex flex-column'>
                        <Card>
                            <Card.Img variant="top" className='w-100' src="images/article.jpg" />
                            <Card.Body>
                                <Card.Title><a href='/#mainHome'>PS4 Firmware Update 8.03</a></Card.Title>
                                <Card.Text className='text-white'>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={3} className='d-flex flex-column'>
                        <h2 className='topTitle'>Last Published</h2>
                        {
                            this.state.lastPublishedPages.map((item) => {
                                const re = /(?:\.([^.]+))?$/;

                                return (
                                    <Card key={item._id} className='bg-dark text-white'>
                                        <Card.Img src={`http://localhost:8010/img/bg/${item._id}/${re.exec(item.cardBg.originalname)[1]}`} alt='Card image' />
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

                <h2 className='topTitle ml-5'>Gallery</h2>
                <CardGroup>
                    {
                        this.state.topGallery.map((item) => {
                            const re = /(?:\.([^.]+))?$/;

                            return (
                                <Card key={`gallery_${item._id}`} className='bg-dark text-white'>
                                    <Card.Img src={`http://localhost:8010/img/bg/${item._id}/${re.exec(item.cardBg.originalname)[1]}`} alt='Card image' className='home-gallery-pic' />
                                    <Card.ImgOverlay className='d-flex flex-column align-items-center justify-content-between'>
                                        <Card.Title><a href={`/wiki/${item._id}`}>{item.title}</a></Card.Title>
                                        <Card.Text>
                                            Posted by <a href={`/profile:${item.author.userName}`}>{item.author.userName}</a>
                                        </Card.Text>
                                    </Card.ImgOverlay>
                                </Card>
                            )
                        })
                    }
                </CardGroup>
            </>
        );
    };
};