import { FunctionComponent,useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Simulation from "./SimulationChart";

const SimulationIndex:FunctionComponent = () => {

    const [dateSubmit, setDateSubmit] = useState<string>('');
    const [dateValue,setDateValue] = useState<string>('');
    const [validatedForm, setValidatedForm] = useState<boolean>(false);

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
          setDateSubmit(dateValue);
          console.log('Submitted');
        }
    }

    return (
        <div>
            <Form validated={validatedForm} onSubmit={handleSubmit}>
                <Form.Group controlId="date">
                <Form.Label>Enter a simulation date:</Form.Label>
                <Form.Control
                    type="date"
                    placeholder="Enter a simulation date:"
                    onChange={(e: any) => {
                    setDateValue(e.target.value);
                    }}
                    value={dateValue}
                    required
                ></Form.Control>
                </Form.Group>
                <Button type="submit" className="btn-block mt-2">Submit</Button>
            </Form>
            <Simulation date={dateSubmit}/>
        </div>
    )
}

export default SimulationIndex;