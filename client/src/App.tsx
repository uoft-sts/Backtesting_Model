import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";
import { NavigationBar,TopHeader } from "./ts/components/index";

import {Home, About} from "./Home/index";
import Test from "./Test/index";

import "./App.scss";

function App() {
  return (
    <React.Fragment>
      <NavigationBar/>
      <TopHeader/>
      <Container>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/test" component={Test} />
            <Route exact path="/about" component={About} />
          </Switch>
        </Router>
      </Container>
    </React.Fragment>
  );
}

export default App;
