import React, { FunctionComponent, useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

type submitDataType = {
  underlying: string;
  expMonth: string;
  method: string;
  startDate: string;
  endDate: string;
  file: any;
};

const Test: FunctionComponent<any> = (props) => {
  const emptyData: submitDataType = {
    underlying: "",
    expMonth: "",
    method: "",
    startDate: "",
    endDate: "",
    file: "",
  };
  const [validatedForm, setValidatedForm] = useState<boolean>(false);
  const [monthCheck, setMonthCheck] = useState<boolean>(false);
  const [formData, setFormData] = useState<submitDataType>(emptyData);

  const handleSubmit = (e: any) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidatedForm(true);
      setTimeout(() => {
        setValidatedForm(false);
      }, 3000);
    }else{
      console.log(formData);
    }
  };

  return (
    <Form noValidate validated={validatedForm} onSubmit={handleSubmit} action="http://localhost:5000/result" method="POST">
      <Form.Group controlId="underlying">
        <Form.Label>Underlying:</Form.Label>
        <Form.Control
          type="text"
          name="underlying"
          placeholder="Please enter underlying here"
          onChange={(e: any) => {
            setFormData({ ...formData, underlying: e.target.value });
          }}
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
            setFormData({ ...formData, expMonth: e.target.value });
          }}
        />
        <Form.Control.Feedback type="invalid">
          This field can't be empty. And you must enter no more than 2 numbers.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="method">
        <Form.Label>Select a method:</Form.Label>
        <Form.Control
          as="select"
          name="method"
          placeholder="Select a value:"
          required
          onChange={(e: any) => {
            setFormData({ ...formData, method: e.target.value });
          }}
        >
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
            <Form.Label>Select Start date:</Form.Label>
            <Form.Control
              type="date"
              name="daterange_from"
              placeholder="Select start date:"
              onChange={(e: any) => {
                setFormData({ ...formData, startDate: e.target.value });
              }}
              required
            ></Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="enddate">
            <Form.Label>Select End date:</Form.Label>
            <Form.Control
              type="date"
              name="daterange_to"
              placeholder="Select end date:"
              onChange={(e: any) => {
                setFormData({ ...formData, endDate: e.target.value });
              }}
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