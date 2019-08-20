import React, {useState, useContext} from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import fetcher from '../helpers/fetcher';
import "./Auth.css";

const AuthPage = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {login} = useContext(AuthContext);

  const submitHandler = e => {
    e.preventDefault();
    setIsLoading(true);
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!){
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email,
        password
      }
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!){
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
        variables: {
          email,
          password
        }
      };
    }

    fetcher(requestBody)
      .then(res => res.json())
      .then(resData => {
        if (resData.errors) {
          setError(resData.errors[0].message);
          setIsLoading(false);
          setPassword("");
        } else {
          const {token, userId, tokenExpiration} = resData.data.login;
          if (token) {
            setIsLoading(false);
            setEmail("");
            setPassword("");
            setError(null);
            login(token, userId, tokenExpiration);
          }
        }
      })
      .catch(err => {
        setIsLoading(false);
        setPassword("");
        console.log("err", err);
      });
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <React.Fragment>
      <form className="auth-form" onSubmit={submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="submit">
            {isLogin ? "Login" : "SignUp"}
          </button>
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            Switch to {isLogin ? "SignUp" : "Login"}
          </button>
        </div>
        {error && (
          <span
            style={{
              background: "#007bff",
              position: "absolute",
              top: "5rem",
              right: "2rem",
              padding: "5px 10px",
              borderRadius: '5px',
              color: 'white'
            }}
          >
            {error}
          </span>
        )}
      </form>
    </React.Fragment>
  );
};

export default AuthPage;
