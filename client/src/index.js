// Modules
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

// Reducers
import reducers from './reducers';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/main.css';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

// App.js
import App from './App';

// Creating a store - Redux
const store = createStore(reducers, compose(applyMiddleware(thunk)));

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);