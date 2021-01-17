import React, { FunctionComponent } from "react";
import { Jumbotron, Container,Button } from "react-bootstrap";

const TopHeader: FunctionComponent<any> = () => {
  return (
    <Jumbotron fluid>
      <Container>
        <h1>Welcome to STS</h1>
        <p>WIP: we can add more text here...</p>
        <p>
          <Button variant="primary">Learn more</Button>
        </p>
      </Container>
    </Jumbotron>
  );
};

export default TopHeader;
