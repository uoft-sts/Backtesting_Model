import React,{ FunctionComponent,useEffect, useState,Component} from 'react';
import { Container,Row,Col } from 'react-bootstrap';
import ChartNew from './ChartNew';
import Level2 from './Level2';

import TimeNSales from './TimeNSales';

class Simulation extends Component{
    
    render(){
        
        
        return(
            <div>
              <Container>
                <Row>
                  <Col>
                  <p>haha</p>
                    <ChartNew />
                  </Col>
                  <Col>
                  <Row>
                 
                    <Level2 />
                    <TimeNSales />
                    
                  </Row>
                  </Col>
                  </Row>
                 
                </Container>

            </div>
        )

        
    }
}

export default Simulation;