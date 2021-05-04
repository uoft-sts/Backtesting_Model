import React,{ FunctionComponent,useEffect, useState,Component} from 'react';
import ChartNew from './ChartNew';
import Level2 from './Level2';
import {Container, Row, Col} from 'react-bootstrap';

import TimeNSales from './TimeNSales';

class Simulation extends Component{
    
    render(){
        
        
        return(
            <div>
            <Container>
                <Row>
                    <Col>
                    <Level2 />
                    <ChartNew />
                    </Col>
                    <Col>
                    <TimeNSales />
                    </Col>
                </Row>
            </Container>
            </div>
        )

        
    }
}

export default Simulation;