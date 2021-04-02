import React,{ FunctionComponent,useEffect, useState,Component} from 'react';
import ChartNew from './ChartNew';
import { Form, Button, Row, Col, Table, Image, DropdownButton, Dropdown, Container } from "react-bootstrap";
class Level2 extends Component{
    
    render(){
        let arr = []
        let colors = ["primary","secondary","success","danger","warning","info"]
        let prices = [1,2,2,2,3,4,4,4,5,6,6,7,8,9,9,9,10,11]
        let start_Num = 0
        let end_Num = start_Num+1;
        let endlist = 0;
        let color = 0;
        
        
        while(endlist == 0){
            if (end_Num >= prices.length || start_Num == end_Num)
            {
                endlist++;
            } 
            if(prices[start_Num] == prices[end_Num])
            {
                while(prices[start_Num] == prices[end_Num])
                {
                    arr.push(
                        <tr className={"table-"+colors[color]}>
                        <td>EDGA</td>
                        <td>{prices[start_Num]}</td>
                        <td>175.22</td>
                        </tr>
                    )
                    end_Num++;
                }
                arr.push(
                    <tr className={"table-"+colors[color]}>
                    <td>EDGA</td>
                    <td>{prices[start_Num]}</td>
                    <td>175.22</td>
                    </tr>
                )
               
                start_Num = end_Num -1;
                start_Num++;
                end_Num++;
                color++;
                
                
            }
            else
            {
                
                arr.push(
                    <tr className={"table-"+colors[color]}>
                    <td>EDGA</td>
                    <td>{prices[start_Num]}</td>
                    <td>175.22</td>
                    </tr>
                )
                color++;
                start_Num++;
                end_Num++;
            }

            if(color == 5)
            {
                color = 0;
            }
        }
        
    
        
        
        return(

            
           <Container>
               <Row>
    <Col>
  
<Table striped bordered hover>
    
  <thead>
    <tr>
      <th>Market Makers</th>
      <th>Price</th>
      <th>Order Size</th>
    </tr>
  </thead>
  <tbody>
   {arr}
  </tbody>
</Table>
</Col>
<Col>
  
<Table striped bordered hover>
    
  <thead>
    <tr>
      <th>Market Makers</th>
      <th>Price</th>
      <th>Order Size</th>
    </tr>
  </thead>
  <tbody>
    <tr className="table-warning">
    <td>EDGA</td>
      <td>175.25</td>
      <td>175.22</td>
    </tr>
    <tr className="table-success">
    <td>EDGA</td>
      <td>175.25</td>
      <td>175.22</td>
    </tr>
    
  </tbody>
</Table>
</Col>
</Row>
</Container>

        )
    }
}

export default Level2;