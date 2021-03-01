// Modules
import React, { Component } from 'react';
import { Form, Button, Row, Col, Jumbotron, Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon-block";




///////////////////////////////////////////////////////////////////////////////////////////
//? ************************ # LOGGED USER AND WIKI ID
const loggedUser = JSON.parse(localStorage.getItem('Leviathan'));






///////////////////////////////////////////////////////////////////////////////////////////
//? ************************ # CKEDITOR 5

// CKEditor-5 Configuration
const editorConfiguration = {
    toolbar: {
        items: [
            'bold',
            'italic',
            'link',
            'strikethrough',
            'underline',
            'subscript',
            'superscript',
            '|',
            'specialCharacters',
            'removeFormat',
            '|',
            'alignment',
            'indent',
            'outdent',
            'numberedList',
            'bulletedList',
            '|',
            'fontColor',
            'fontSize',
            'fontFamily',
            'fontBackgroundColor'
        ]
    },
    language: 'en',
    blockToolbar: [
        'heading',
        'alignment',
        'numberedList',
        'bulletedList',
        '|',
        'blockQuote',
        'insertTable',
        // 'imageInsert',
        'imageUpload',
        'mediaEmbed',
        '|',
        'horizontalLine',
        '|',
        'undo',
        'redo'
    ],
    image: {
        styles: [
            'alignLeft', 'alignCenter', 'alignRight'
        ],
        resizeOptions: [
            {
                name: 'imageResize:original',
                value: null,
                icon: 'original'
            },
            {
                name: 'imageResize:50',
                value: '50',
                icon: 'medium'
            },
            {
                name: 'imageResize:75',
                value: '75',
                icon: 'large'
            }
        ],
        toolbar: [
            'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
            '|',
            'imageResize:50',
            'imageResize:75',
            'imageResize:original',
            '|',
            'imageTextAlternative'
        ]
    },
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'tableCellProperties',
            'tableProperties'
        ]
    },
    headers: {
        SameSite: 'secure'
    },
    extraPlugins: [MyCustomUploadAdapterPlugin],
    imageRemoveEvent: {
        callback: (imagesSrc, nodeObjects) => {
            // note: imagesSrc is array of src & nodeObjects is array of nodeObject
            // node object api: https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_node-Node.html

            console.log('callback called', imagesSrc, nodeObjects);

            // Take the params
            const keys = imagesSrc[0].split('/');
            const wikiId = keys[3];
            const fileName = keys[6];
            const fileExt = keys[5];

            // Setting the url
            const url = `http://localhost:8010/deletePhoto/${wikiId}/${fileName}/${fileExt}`

            axios.post(url)
                .then(console.log('Image deleted from DB'))
                .catch(err => console.log(err));
        }
    },
    licenseKey: '',
};

// Extra Plugin
function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        // Configure the URL to the upload script in your back-end here!
        const newWikiPageId = window.location.href.split('/')[5];
        return new MyUploadAdapter(loader, newWikiPageId);
    };
};

// Upload Adapter
class MyUploadAdapter {
    constructor(loader, newWikiId) {
        // The file loader instance to use during the upload.
        this.loader = loader;
        // console.log(newWikiId);

        // URL where to send files.
        this.url = `http://localhost:8010/newWiki/picturesUpload/${loggedUser.user._id}/${newWikiId}`;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                this._initRequest();
                this._initListeners(resolve, reject, file);
                this._sendRequest(file);
            }));
    };

    // Aborts the upload process.
    abort() {
        if (this.xhr) {
            this.xhr.abort();
        };
    };

    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();

        xhr.open('POST', this.url, true);
        xhr.responseType = 'json';
    };

    // Initializes XMLHttpRequest listeners.
    _initListeners(resolve, reject, file) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${file.name}.`;

        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;

            if (!response || response.error) {
                return reject(response && response.error ? response.error.message : genericErrorText);
            };

            resolve({
                default: response.url
            });
        });

        if (xhr.upload) {
            xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                };
            });
        };
    };

    // Prepares the data and sends the request.
    _sendRequest(file) {
        // Prepare the form data.
        const data = new FormData();

        data.append('upload', file);

        // Send the request.
        this.xhr.send(data);
    };
};

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////



// Main Component
export default class NewWikiPage extends Component {

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

                // WikiId
                wikiId: this.props.match.params.newWikiPageId
            };
        };

        // Binding
        this.requestHandler = this.requestHandler.bind(this);
        this.inputChange = this.inputChange.bind(this);
    };



    ///////////////////////////////////////////////////////////////////////////////////////////
    //? ************************ # FUNCTIONS


    //? *************************** # Handlers # ***********************************
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
    inputCardBg = (event) => {

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
    //? ****************************************************************************


    //? ******************** Editing-Mode ******************************************
    // Update the state on cwriting in the Editor
    handleEditorChange = (editor) => {
        const data = editor.getData();

        this.setState({
            content: data
        });
    };

    // Request to the server
    requestHandler = (event) => {
        event.preventDefault();

        const { cardBackGroundImage } = this.state;
        const data = this.state;
        const formData = new FormData();

        formData.append('body', JSON.stringify(data));
        formData.append('cardBackGroundImage', cardBackGroundImage);

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        axios.post(`http://localhost:8010/newWiki/publish/${loggedUser.user._id}/${this.state.wikiId}`, formData, config)
            .then((result) => {

                console.log(result);

                console.log(`${result.request.status} ${result.request.statusText}`);

                switch (result.request.status) {
                    case 200:
                        this.setState(result.data);
                        setTimeout(() => {
                            this.props.history.push(`/profile:${loggedUser.user.userName}`);
                            window.location.reload(true);
                        }, 2500);
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

                    default:
                        break;
                };
            });
    };
    //? ****************************************************************************


    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////

    hr

    // Render
    render() {

        if (!this.state.isLogged) {
            return <Redirect to={{
                pathname: '/unauthorized',
                state: { message: 'Unauthorized' }
            }} />
        }

        const editorPremadeTemplate = `<h1>Welcome to the Wiki's Editor!</h1><hr><figure class="table" style="float:right;height:400px;width:400px;"><table><tbody><tr><td style="vertical-align:top;"><p>&nbsp;</p><p><strong>Insert an image Here</strong></p><p><strong>Add some infos down</strong></p><p><strong>Personalize this table</strong></p></td></tr><tr><td style="height:50px;vertical-align:bottom;"><strong>Personalize other Areas</strong></td></tr></tbody></table></figure><h3>Infos</h3><p><strong>This template is a example template that shows you what can you do with this editor.</strong><br><strong>You can change this template with adding other images and tables or modify the exiting ones.</strong></p><p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.&nbsp;Distinctio cumque non illum. Esse explicabo, temporibus, ea blanditiis itaque perspiciatis quaerat at officiis laborum doloribus aspernatur facere minima deleniti hic laudantium</p><p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.&nbsp;Distinctio cumque non illum. Esse explicabo, temporibus, ea blanditiis itaque perspiciatis quaerat at officiis laborum doloribus aspernatur facere minima deleniti hic laudantium Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio cumque non illum. Esse explicabo, temporibus, ea blanditiis itaque perspiciatis quaerat at officiis laborum doloribus aspernatur facere minima deleniti hic laudantium</p><p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.&nbsp;Distinctio cumque non illum. Esse explicabo, temporibus, ea blanditiis itaque perspiciatis quaerat at officiis laborum doloribus aspernatur facere minima deleniti hic laudantium Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio cumque non illum. Esse explicabo, temporibus, ea blanditiis itaque perspiciatis quaerat at officiis laborum doloribus aspernatur facere minima deleniti hic laudantium</p><p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.&nbsp;Distinctio cumque non illum. Esse explicabo, temporibus, ea blanditiis itaque perspiciatis quaerat at officiis laborum doloribus aspernatur facere minima deleniti hic laudantiumLorem ipsum dolor sit amet consectetur, adipisicing elit.&nbsp;Distinctio cumque non illum. Esse explicabo, temporibus, ea blanditiis itaque perspiciatis quaerat at officiis laborum doloribus aspernatur facere minima deleniti hic laudantium</p><hr><figure class="table" style="float:left;height:400px;width:400px;"><table><tbody><tr><td style="vertical-align:top;"><p>&nbsp;</p><p><strong>Insert an image Here</strong></p><p><strong>Add some infos down</strong></p><p><strong>Personalize this table</strong></p></td></tr><tr><td style="height:50px;vertical-align:bottom;"><p style="margin-left:40px;"><strong>Personalize other Areas</strong></p></td></tr></tbody></table></figure><h3>Title 2</h3><p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.&nbsp;Distinctio cumque non illum. Esse explicabo, temporibus, ea blanditiis itaque perspiciatis quaerat at officiis laborum doloribus aspernatur facere minima deleniti hic laudantium</p><p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.&nbsp;Distinctio cumque non illum. Esse explicabo, temporibus,&nbsp;</p><p>explicabo, temporibus, ea blanditiis itaque perspiciatis quaerat at officiis laborum doloribus aspernatur facere minima deleniti hic laudantium Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio cumque non illum. Esse explicabo, temporibus, ea blanditiis itaque perspiciatis quaerat at officiis laborum doloribus aspernatur facere minima deleniti hic laudantium</p><p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.&nbsp;Distinctio cumque non illum. Esse explicabo, temporibus, ea blanditiis itaque perspiciatis quaerat at officiis laborum doloribus aspernatur facere minima deleniti hic laudantium Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio cumque non illum. Esse explicabo, temporibus, ea blanditiis itaque perspiciatis quaerat at officiis laborum doloribus aspernatur facere minima deleniti</p><hr><figure class="table" style="height:700px;width:700px;"><table><tbody><tr><td colspan="6">&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table></figure>`

        return (
            <>

                <Form
                    autoComplete="off"
                    onSubmit={this.requestHandler}
                    ref={form => this.form = form}
                    id='form'>

                    <Jumbotron fluid className='header'>
                        <Container>
                            <h2>New Wikipage settings</h2>
                            <hr />
                            <Row>
                                <Col md="6">
                                    <Form.Group controlId="tile">
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Write the Wiki's Title"
                                            name="title"
                                            required
                                            onChange={this.inputChange} />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md="6">
                                    <Form.Group controlId="gameSerie" className='selectdiv'>
                                        <Form.Label>Game Serie</Form.Label>
                                        <Form.Control as="select" defaultValue="N/A" name="gameSerie" required onChange={this.inputChange}>
                                            <option value="N/A">N/A</option>
                                            <option value="Battlefield">Battlefield</option>
                                            <option value="Call of Duty">Call of Duty</option>
                                            <option value="Grand Theft Auto">Grand Theft Auto</option>
                                            <option value="The Sims">The Sims</option>
                                            <option value="The Witcher">The Witcher</option>
                                            <option value="The Elder Scrolls">The Elder Scrolls</option>
                                            <option value="Assassin's Creed">Assassin"s Creed</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md="4">
                                    <Form.Group controlId="type">
                                        <Form.Label>Type of page</Form.Label>
                                        <Form.Control as="select" defaultValue="N/A" name="type" required onChange={this.inputChange}>
                                            <option value="N/A">N/A</option>
                                            <option value="Wiki">Wiki</option>
                                            <option value="Gallery">Gallery</option>
                                            <option value="Guide">Guide</option>
                                            <option value="Changelog">Changelog</option>
                                            <option value="Article">Article</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>

                                <Col md="4">
                                    <Form.Group controlId="genre">
                                        <Form.Label>Genre</Form.Label>
                                        <Form.Control as="select" defaultValue="N/A" name="genre" required onChange={this.inputChange}>
                                            <option value="N/A">N/A</option>
                                            <option value="Action">Action</option>
                                            <option value="Platform">Platform</option>
                                            <option value="RPG">RPG</option>
                                            <option value="FPS">FPS</option>
                                            <option value="RTS">RTS</option>
                                            <option value="Survival">Survival</option>
                                            <option value="Horror">Horror</option>
                                            <option value="Simulation">Simulation</option>
                                            <option value="MOBA">MOBA</option>
                                            <option value="MMORPG">MMORPG</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>

                                <Col md="4">
                                    <Form.Group controlId="relation">
                                        <Form.Label>Relation</Form.Label>
                                        <Form.Control as="select" defaultValue="N/A" name="relation" required onChange={this.inputChange}>
                                            <option value="N/A">N/A</option>
                                            <option value="General">General</option>
                                            <option value="Character">Character</option>
                                            <option value="World">World</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md="12">
                                    <Form.File controlId="cardBackGroundImage">
                                        <Form.File.Label>Type of page</Form.File.Label>
                                        <Form.File.Input name="cardBackGroundImage" required onChange={this.inputCardBg} />
                                    </Form.File>
                                </Col>
                            </Row>

                            <Button variant='warning' type='submit' className='mt-5'>
                                Submit
                            </Button>
                        </Container>
                    </Jumbotron>

                    <div id='wikiContainer'>
                        <CKEditor
                            editor={BalloonEditor}
                            data={editorPremadeTemplate}
                            onReady={editor => {
                                console.log('Editor is ready to use!', editor);
                                this.setState({
                                    content: editor.getData()
                                });
                            }}
                            config={editorConfiguration}
                            onChange={(event, editor) => {
                                this.handleEditorChange(editor);
                            }}
                        />
                    </div>
                </Form>
            </>
        );
    }
}