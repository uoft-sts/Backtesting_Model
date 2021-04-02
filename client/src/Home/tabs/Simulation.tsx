import React,{ FunctionComponent,useEffect, useState,Component} from 'react';
import ChartNew from './ChartNew';
import Level2 from './Level2';
import { Form, Button, Row, Col, Table, Image, DropdownButton, Dropdown } from "react-bootstrap";
class Simulation extends Component{
    
    render(){
        
        
        return(

            
            <div>
              <Level2 />
            <Form.Group controlId="enddate">
                <Form.Label>Select End Date:</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Select end date:"
                  required
                ></Form.Control>
              </Form.Group>
          
          <Button type="submit" className="btn-block mt-2">Submit form</Button>
        
            <ChartNew />
            </div>
        )

        
    }
}

export default Simulation;