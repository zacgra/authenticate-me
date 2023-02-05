import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as sessionActions from "../../store/session";

import "./LoginForm.css";

export default function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (sessionUser) return navigate("/");
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credentials, password })).catch(
      async (res) => {
        let data;
        try {
          // clone allows for reading res
          data = await res.clone().json();
        } catch {
          // if server is down
          data = await res.text();
        }
        if (data?.errors) {
          setErrors(data.errors);
        } else if (data) setErrors([data]);
        else setErrors([res.statusText]);
      }
    );
  };

  function renderErrors() {
    if (errors.length > 0) {
      return (
        <ul>
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      );
    } else {
      return <></>;
    }
  }

  return (
    <div id="form-content">
      <h1>Log In</h1>
      {renderErrors()}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            placeholder="Name or Email"
            id="credentials"
            type="text"
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            placeholder="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
      <button
        id="signup-btn"
        onClick={() => {
          navigate("/signup");
        }}
      >
        Sign Up
      </button>
    </div>
  );
}
