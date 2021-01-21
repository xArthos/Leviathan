// Modules
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Components
// Layout
import Footer from './Components/layout/Footer';
import NavBar from './Components/layout/NavBar';
// Pages
import Main from './Components/pages/Home';
import LogUser from './Components/pages/Login';


///////////////////////////////////////////////////////////////////////////////////////////////////////////////


const App = () => {

  return (
    <Router>
      {/* Navbar */}
      <NavBar />

      {/* Main */}
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/user/signIn" component={LogUser} />
        <Route render={() => <h1>404: page not found</h1>} />
      </Switch>

      {/* Footer */}
      <Footer />

    </Router>
  );
};

export default App;