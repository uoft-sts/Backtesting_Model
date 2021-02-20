import React, { FunctionComponent, useEffect, useState } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import axios from "axios";

type submitDataType = {
  underlying: string;
  expMonth: string;
  methods: string;
  daterange_from: string;
  daterange_to: string;
};

const Test: FunctionComponent<any> = (props) => {
  const emptyData: submitDataType = {
    underlying: "",
    expMonth: "",
    methods: "",
    daterange_from: "",
    daterange_to: "",
  };

  const [validatedForm, setValidatedForm] = useState<boolean>(false);
  const [monthCheck, setMonthCheck] = useState<boolean>(false);
  const [formData, setFormData] = useState<submitDataType>(emptyData);
  const [tableHeader, setTableHeader] = useState<any>(<></>);
  const [tableRows, setTableRows] = useState<any>(<></>);
  const [showbutton, setShowButton] = useState<boolean>(true);

  const handleSubmit = (e: any) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidatedForm(true);
      setTimeout(() => {
        setValidatedForm(false);
      }, 3000);
    } else {
      console.log(formData);
      axios({
        method: "post",
        url: "http://127.0.0.1:5000/result/",
        params: formData,
      })
        .then((response) => {
          setShowButton(!showbutton);
          console.log(response.data);
          let tempHeader = Object.keys(response.data).map((d) => <th>{d}</th>);
          let tempRows = Object.keys(response.data).map((d) => (
            <td>{response.data[d]}</td>
          ));
          setTableHeader(tempHeader);
          setTableRows(tempRows);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div>
      <Button
        variant="outline-primary"
        onClick={() => {
          setShowButton(!showbutton);
        }}
      >
        {showbutton ? "Hide Input Form" : "Show Input Form"}
      </Button>
      {showbutton ? (
        <Form noValidate validated={validatedForm} onSubmit={handleSubmit}>
          <Form.Group controlId="underlying">
            <Form.Label>Underlying:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Please enter underlying here"
              onChange={(e: any) => {
                setFormData({ ...formData, underlying: e.target.value });
              }}
              value={formData.underlying}
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
              placeholder="Please enter expiration month here"
              required
              isInvalid={monthCheck}
              value={formData.expMonth}
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
              This field can't be empty. And you must enter no more than 2
              numbers.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="methods">
            <Form.Label>Select a method:</Form.Label>
            <Form.Control
              as="select"
              placeholder="Select a value:"
              onChange={(e: any) => {
                setFormData({ ...formData, methods: e.target.value });
              }}
              value={formData.methods}
              required
            >
              <option></option>
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
                <Form.Label>Select Start Date:</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Select start date:"
                  onChange={(e: any) => {
                    setFormData({
                      ...formData,
                      daterange_from: e.target.value,
                    });
                  }}
                  value={formData.daterange_from}
                  required
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="enddate">
                <Form.Label>Select End Date:</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Select end date:"
                  onChange={(e: any) => {
                    setFormData({ ...formData, daterange_to: e.target.value });
                  }}
                  value={formData.daterange_to}
                  required
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit">Submit form</Button>
        </Form>
      ) : (
        <></>
      )}
      <Table striped bordered hover>
        <thead>
          <tr>{tableHeader}</tr>
        </thead>
        <tbody>
          <tr>{tableRows}</tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Test;
