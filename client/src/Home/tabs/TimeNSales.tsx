import React,{ FunctionComponent,useEffect, useState,Component} from 'react';
import ChartNew from './ChartNew';
import { Form, Button, Row, Col, Table, Image, DropdownButton, Dropdown, Container } from "react-bootstrap";

class TimeNSales extends Component{

    createTable = () => {
        var my_data = [[10,11,12,13,14,15,17,18],[1,2,3,1,2,3,1,2],[1,2,3,1,2,3,1,2]]
        let table = []
        // Outer loop to create parent
        for (let i = 0; i < 3; i++) {
          let children = []
          //Inner loop to create children
          for (let j = 0; j < my_data[1].length; j++) {
            children.push(<td>{`hello ${my_data[i][j]}`}</td>)
          }
          //Create the parent and add the children
          table.push(<tr>{children}</tr>)
        }
        return table
    }





    render(){

        
        return(
            <Container>
                <Row>
                <Col sm={4}>

                <Table striped bordered hover>
    <thead>
        <tr>
        <th>MM</th>
        <th>Bid</th>
        <th>Size</th>
        <th>Time</th>
        <th>MM</th>
        <th>Bid</th>
        <th>Size</th>
        <th>Time</th>
        </tr>
    </thead>
    <tbody>
        {this.createTable()}  


        {/* <tr>
      <td>1</td>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <td>3</td>
      <td colSpan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr> */}
    </tbody>
    </Table>
    </Col>
                </Row>

            </Container>
)
}
}

export default TimeNSales;







