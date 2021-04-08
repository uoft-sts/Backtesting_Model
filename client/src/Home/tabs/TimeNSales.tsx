import React,{ FunctionComponent,useEffect, useState,Component} from 'react';
import ChartNew from './ChartNew';
import { Form, Button, Row, Col, Table, Image, DropdownButton, Dropdown, Container } from "react-bootstrap";

class TimeNSales extends Component{

    createTable = () => {
        var my_data = [[10,11,12,13,14,15,17,18],[1,2,3,1,2,3,1,2],[1,2,3,1,2,3,1,2],[10,11,12,13,14,15,17,18],[10,11,12,13,14,15,17,18]]
        let table = []
        var colour = ["table-primary","table-secondary","table-success", "table-danger"]
        // Outer loop to create parent
        var k=0
        for (let i = 0; i < my_data.length; i++) {
          let children = []
          //Inner loop to create children
          for (let j = 0; j < my_data[1].length; j++) {
            children.push(<td>{`hello ${my_data[i][j]}`}</td>)
          }
          //Create the parent and add the children
          table.push(<tr className={colour[k]}>{children}</tr>)
          k+=1
          if (k == 4) {
            k = 0
          }
        }
        return table
    }

    
    createUpperTable = () => {
      var my_data_second = [10,11,12,13,14,15]
      let table = []
      // Outer loop to create parent
      var k=0
        let children = []
        //Inner loop to create children
        // children.push(<td >{`hello ${my_data[i][j]}`}</td>)
        children.push(<td>{`Bid ${my_data_second[0]}`}</td>)
        children.push(<td>{`Bid Size${my_data_second[1]}`}</td>)
        children.push(<td>{`Low ${my_data_second[2]}`}</td>)
        children.push(<td>{`change`}</td>)
        //Create the parent and add the children
        table.push(<tr>{children}</tr>)

        children = []
        children.push(<td>{`Ask ${my_data_second[0]}`}</td>)
        children.push(<td>{`Ask Size ${my_data_second[1]}`}</td>)
        children.push(<td >{`High ${my_data_second[2]}`}</td>)
        children.push(<td>{`change(open)`}</td>)
        //Create the parent and add the children
        table.push(<tr>{children}</tr>)
        k+=1
        if (k == 4) {
          k = 0
        }
      
      return table
  }




    render(){

        
        return(
            <Container>
                <Row>
                <Col sm={4}>

                <Table striped bordered hover className="table table-lg">
    <tbody>
        {this.createUpperTable()}  

          <tr>
            <td colSpan={4}>
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
    </tbody>
    </Table>
            </td>
          </tr>



    </tbody>
    </Table>



    </Col>
                </Row>

            </Container>
)
}
}

export default TimeNSales;







