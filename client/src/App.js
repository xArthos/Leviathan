// Modules
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

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
import NewWikiPage from './Components/pages/NewWikiPage';
import WikiPage from './Components/pages/WikiPage';
import Wikis from './Components/pages/Wikis';


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
      <Switch>
        <Route path='/' exact component={Main} />
        <Route path='/login' component={LogUser} />
        <Route path='/allUsersList' component={Users} />
        <Route path='/wikis' component={Wikis} />
        <Route path='/register' component={Register} />
        <Route path='/success' component={Succesufully} />
        <Route path='/unauthorized' component={ErrorPage} />
        <Route path='/profile::userName' exact component={Profile} />
        <Route path='/profile::userName/edit' exact component={ProfileEditInfo} />
        <Route path='/profile::userName/newWikiPage/:newWikiPageId' exact component={NewWikiPage} />
        <Route path='/wiki/:WikiPageId' exact component={WikiPage} />


        {/* 404 Page */}
        <Route path='*' component={() => <ErrorPage message={'404 Not Found'} />} />
      </Switch>

      {/* Footer */}
      <Footer />
    </Router>
  );
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Export Component
export default App;