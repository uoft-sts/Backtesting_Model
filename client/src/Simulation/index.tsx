import { FunctionComponent } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Level2 from '../Home/tabs/Level2';
import TimeNSales from '../Home/tabs/TimeNSales';
import Candlestick from '../Home/tabs/Candlestick';

const Simulation: FunctionComponent = () => {


  return (
    <div>
      <div><Candlestick /></div>
      <Container>
      
        <Row>
          <Col>
            <Level2 />
          </Col>
          <Col>
            <TimeNSales />
          </Col>
        </Row>
      </Container>

    </div>
  );
}

export default Simulation;