import React from "react";
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import Navigation from './components/Navigation/Navigation';
import "./App.css" ;

function App() {
  return (
    <Router>
      <Navigation />
      <main className="main-content">
        <Switch>
          <Redirect exact path="/" to="/auth" component={null} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/bookings" component={BookingsPage} />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
