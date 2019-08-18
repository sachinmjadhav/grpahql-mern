import React, {useState} from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

import AuthPage from "./pages/Auth";
import EventsPage from "./pages/Events";
import BookingsPage from "./pages/Bookings";
import Navigation from "./components/Navigation/Navigation";
import AuthContext from "./context/auth-context";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (token, userId, tokenExpiration) => {
    setToken({token});
    setUserId({userId});
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  return (
    <Router>
      <AuthContext.Provider value={{token, userId, login, logout}}>
        <Navigation />
        <main className="main-content">
          <Switch>
            {!token && (
              <Redirect exact path="/bookings" to="/auth" />
              )}
            {token && (
              <Redirect exact path="/" to="/events" />
              )}
            {token && (
              <Redirect exact path="/auth" to="/events" />
              )}
            {!token && <Route path="/auth" component={AuthPage} />}
            <Route path="/events" component={EventsPage} />
            {token && <Route path="/bookings" component={BookingsPage} />}
            {!token && (
              <Redirect exact  to="/auth" />
            )}
          </Switch>
        </main>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
