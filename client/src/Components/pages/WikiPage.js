// Modules
import React, { Component } from 'react';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon-block";



///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////



// Main Component
export default class NewWikiPage extends Component {

    // Constructor
    constructor(props) {
        super(props);

        //* State
        this.state = {

            // WikiId
            wikiId: this.props.match.params.WikiPageId,

            // Contnet
            content: ''
        };
    };


    ///////////////////////////////////////////////////////////////////////////////////////////
    //? ************************ # FUNCTIONS

    //? ******************** Request Handler ***************************************

    // Request to the server
    componentDidMount() {
        axios.get(`http://localhost:8010/wiki/${this.state.wikiId}`)
            .then((result) => {
                console.log(`${result.request.status} ${result.request.statusText}`);

                switch (result.request.status) {
                    case 200:
                        this.setState(result.data);
                        if (this.state.message) {
                            delete this.state['message'];
                        };
                        console.log(this.state);
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


    // Render
    render() {

        return (
            <>
                <CKEditor
                    disabled
                    editor={BalloonEditor}
                    data={`${this.state.content}`}
                />
            </>
        );
    }
}