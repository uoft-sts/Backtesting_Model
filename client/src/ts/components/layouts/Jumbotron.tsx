import React, { FunctionComponent } from "react";
import { Jumbotron, Container,Button } from "react-bootstrap";

const TopHeader: FunctionComponent<any> = () => {
  return (
    <Jumbotron fluid>
      <Container>
        <h1>Welcome to Project Alpha</h1>
        <p>Backtesting Engine</p>
        <p>
          <Button variant="primary">Learn more</Button>
        </p>
      </Container>
    </Jumbotron>
  );
};

export default TopHeader;
