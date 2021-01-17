import React, { FunctionComponent } from "react";
import { Nav, Navbar } from "react-bootstrap";
import "./layouts.scss";

const NavigationBar: FunctionComponent<any> = () => {
  return (
    <div className="main--nav-bar">
      <Navbar expand="lg">
        <Navbar.Brand href="/">STS Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" />
        <Nav>
          <Nav.Item>
            <Nav.Link href="/test">Test</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/about">About</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar>
    </div>
  );
};

export default NavigationBar;
