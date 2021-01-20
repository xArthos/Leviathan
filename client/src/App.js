// Modules
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Components
// Layout
import MainNavBar from './Components/layout/NavBar';
import Footer from './Components/layout/Footer';
// Pages
import Main from './Components/pages/Home';
import LogUser from './Components/pages/Login'

export default class App extends Component {

  render() {
    return (
      <Router>
        {/* Navbar */}
        <MainNavBar />

        {/* Main */}
        <Route path="/" exact component={Main} />
        <Route path="/user/signIn" component={LogUser} />

        {/* Footer */}
        <Footer />

      </Router>
    );
  }
}