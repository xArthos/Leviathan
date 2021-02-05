// Modules
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';

// Actions
import { getUsers } from './actions/users';

// Components
// Layout
import Footer from './Components/layout/Footer';
import MainNavBar from './Components/layout/NavBar';
// Pages
import Main from './Components/pages/Home';
import LogUser from './Components/pages/Login';
import Users from './Components/pages/Users';
import Register from './Components/pages/Register';
import Succesufully from './Components/pages/Succesufully';
import Profile from './Components/pages/Profile';
import ErrorPage from './Components/pages/Error';
import ProfileEditInfo from './Components/pages/ProfileEditInfo';


///////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Component App
const App = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch]);

  return (
    <Router history={history}>
      {/* Navbar */}
      <MainNavBar />

      {/* Main */}
      <Container id='mainContainer'>
        <Switch>
          <Route path='/' exact component={Main} />
          <Route path='/login' component={LogUser} />
          <Route path='/usersList' component={Users} />
          <Route path='/register' component={Register} />
          <Route path='/success' component={Succesufully} />
          <Route path='/unauthorized' component={ErrorPage} />
          <Route path='/profile::userName' exact component={Profile} />
          <Route path='/profile::userName/edit' exact component={ProfileEditInfo} />

          {/* 404 Page */}
          <Route path='*' component={() => <ErrorPage message={'404 Not Found'} />} />
        </Switch>
      </Container>

      {/* Footer */}
      <Footer />
    </Router>
  );
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Export Component
export default App;