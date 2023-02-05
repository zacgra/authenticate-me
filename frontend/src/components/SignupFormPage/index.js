import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as sessionActions from "../../store/session";

import "./SignupForm.css";

export default function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = { username, email, password };
    if (password === confirmPassword) {
      setErrors([]);

      const response = dispatch(sessionActions.signup(params))
        .catch(async (res) => {
          let data;
          try {
            data = await res.clone().json();
          } catch {
            data = await res.text();
          }
          if (data?.errors) {
            setErrors(data.errors);
          } else if (data) {
            setErrors([data]);
          } else {
            setErrors([res.statusText]);
          }
        })
        .then((res) => {
          if (res?.ok) {
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setUsername("");
          }
          navigate("/");
        });
      return response;
    }
    return setErrors(["Confirm password doesn't match"]);
  };

  function renderErrors() {
    if (errors.length > 0) {
      return (
        <ul>
          {errors.map((error) => (
            <li key={error}> {error}</li>
          ))}
        </ul>
      );
    } else {
      return <></>;
    }
  }

  return (
    <div id="form-content">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} action="/api/users">
        {renderErrors()}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            placeholder="Username"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            placeholder="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            placeholder="Password"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
