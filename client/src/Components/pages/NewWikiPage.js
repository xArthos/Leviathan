// Modules
import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
// import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon-block";

// Upload Adapter
class UploadAdapter {
    constructor(loader) {
        // CKEditor 5's FileLoader instance.
        this.loader = loader;

        // URL where to send files.
        this.url = 'http://localhost:8010/wiki';
    };

    // Starts the upload process.
    upload() {
        return new Promise((resolve, reject) => {
            this._initRequest();
            this._initListeners(resolve, reject);
            this._sendRequest();
        });
    };

    // Aborts the upload process.
    abort() {
        if (this.xhr) {
            this.xhr.abort();
        };
    };

    // Example implementation using XMLHttpRequest.
    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();

        xhr.open('POST', this.url, true);
        xhr.responseType = 'json';
    };

    // Initializes XMLHttpRequest listeners.
    _initListeners(resolve, reject) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${loader.file.name}.`;

        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;

            if (!response || response.error) {
                return reject(response && response.error ? response.error.message : genericErrorText);
            };

            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.
            resolve({
                default: response.url
            });
        });

        if (xhr.upload) {
            xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        };
    };

    // Prepares the data and sends the request.
    _sendRequest() {
        const data = new FormData();
        console.log(this.loader.file)

        data.append('upload', this.loader.file);

        this.xhr.send(data);
    };
};

const editorConfiguration = {
    toolbar: {
        items: [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'link',
            'subscript',
            'superscript',
            '|',
            'fontFamily',
            'fontSize',
            'fontColor',
            'fontBackgroundColor',
            'highlight',
            '|',
            'indent',
            'outdent',
            '|',
            'specialCharacters',
            '|',
            'removeFormat',
            '|',
            'undo',
            'redo'
        ]
    },
    language: 'en',
    blockToolbar: [
        'heading',
        'alignment',
        'numberedList',
        'bulletedList',
        'todoList',
        '|',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'imageInsert',
        '|',
        'horizontalLine',
        'pageBreak',
        '|',
        'exportPdf',
        'exportWord',
        '|',
        'htmlEmbed',
        'imageUpload',
        'CKFinder',
        '|',
        'pageNavigation',
        'previousPage',
        'nextPage'
    ],
    image: {
        toolbar: [
            'imageTextAlternative',
            'imageStyle:full',
            'imageStyle:side',
            'linkImage'
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
    licenseKey: '',
};

export default class NewWikiPage extends Component {

    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            content: ''
        };

        this.requestHandler = this.requestHandler.bind(this);
    };


    handleEditorChange = (editor) => {

        const data = editor.getData();

        this.setState({
            content: data
        });
    };

    // Request to the server
    requestHandler = (event) => {
        event.preventDefault();

        const data = this.state;

        console.log(data);

        const config = {
            headers: {
                'content-type': 'application/json'
            }
        };
        axios.post('http://localhost:8010/wiki', data, config)
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



    render() {
        return (
            <>
                <Form
                    autoComplete='off'
                    onSubmit={this.requestHandler}
                    ref={form => this.form = form}>

                    <CKEditor
                        editor={ BalloonEditor }
                        data="<h1>Hello from CKEditor 5!</h1>"
                        onReady={ editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log( 'Editor is ready to use!', editor );
                        } }
                        config={ editorConfiguration }
                        onChange={ ( event, editor ) => {
                            this.handleEditorChange(editor);
                            // const data = editor.getData();
                            // console.log( { event, editor, data } );
                        } }
                        onBlur={ ( event, editor ) => {
                            // console.log( 'Blur.', editor );
                        } }
                        onFocus={ ( event, editor ) => {
                            // console.log( 'Focus.', editor );
                        } }
                    />

                    <Button variant='primary' type='submit'>
                        Submit
                    </Button>

                </Form>
            </>
        );
    }
}