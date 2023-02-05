import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import Home from "./components/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignupFormPage />} />
      <Route path="/login" element={<LoginFormPage />} />
    </Routes>
  );
}

export default App;
