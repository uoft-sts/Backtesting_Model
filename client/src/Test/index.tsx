import React, { FunctionComponent, useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const Test: FunctionComponent<any> = (props) => {
  const [validatedForm, setValidatedForm] = useState<boolean>(false);
  const [monthCheck, setMonthCheck] = useState<boolean>(false);

  const handleSubmit = (e: any) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidatedForm(true);
  };

  return (
    <Form noValidate validated={validatedForm} onSubmit={handleSubmit} action="http://localhost:5000/result" method="POST">
      <Form.Group controlId="underlying">
        <Form.Label>Underlying:</Form.Label>
        <Form.Control
          type="text"
          name="underlying"
          placeholder="Please enter underlying here"
          required
        />
        <Form.Control.Feedback type="invalid">
          Underlying can't be empty.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="expiremonth">
        <Form.Label>Expiration Month:</Form.Label>
        <Form.Control
          type="number"
          name="expmonth"
          placeholder="Please enter expiration month here"
          required
          isInvalid={monthCheck}
          onChange={(e: any) => {
            if (e.target.value > 99 || e.target.value === null) {
              setMonthCheck(true);
            } else {
              setMonthCheck(false);
            }
          }}
        />
        <Form.Control.Feedback type="invalid">
          This field can't be empty. And you must enter no more than 2 numbers.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="method">
        <Form.Label>Select a method:</Form.Label>
        <Form.Control as="select" name="method" placeholder="Select a value:" required>
          <option>First Of Month</option>
          <option>Last Trading Day</option>
          <Form.Control.Feedback type="invalid">
            You must select a value.
          </Form.Control.Feedback>
        </Form.Control>
      </Form.Group>
      <Row>
        <Col>
          <Form.Group controlId="startdate">
            <Form.Label>Select date:</Form.Label>
            <Form.Control
              type="date"
              name="daterange_from"
              placeholder="Select start date:"
              required
            ></Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="enddate">
            <Form.Label>Select date:</Form.Label>
            <Form.Control
              type="date"
              name="daterange_to"
              placeholder="Select end date:"
              required
            ></Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Button type="submit">Submit form</Button>
    </Form>
  );
};

export default Test;
