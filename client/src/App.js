import React, { Fragment } from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// components
import InputTodo from "./components/InputTodo";
import ListTodos from "./components/ListTodos";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Fragment>
        <div className="container">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/todos" element={<PrivateRoute />}>
              <Route path="" element={<>
                <InputTodo />
                <ListTodos />
              </>} />
            </Route>
          </Routes>
        </div>
      </Fragment>
    </Router>
  );
}

export default App;
