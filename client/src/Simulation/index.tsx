import { FunctionComponent, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Level2 from '../Home/tabs/Level2';
import TimeNSales from '../Home/tabs/TimeNSales';
import axios from "axios";

type submitDataType = {
  date: string;
};

const Simulation: FunctionComponent = () => {
  let dataIndex = 0;
  let dataIndexLen = 0;
  let timeList: number[] = [];
  let priceList: number[] = [];

  const emptyData: submitDataType = {
    date: ""
  };
  const [formData, setFormData] = useState<submitDataType>(emptyData);
  const [validatedForm, setValidatedForm] = useState<boolean>(false);
  const [chartPresent, setChartPresent] = useState<boolean>(false);

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
        url: "http://127.0.0.1:5000/simulation/",
        params: formData,
      })
        .then(response => {
          const tempData = response.data;
          console.log(tempData.time);
          console.log(tempData.price);
          console.log(tempData.time.length);
          timeList = tempData.time;
          priceList = tempData.price;
          dataIndexLen = tempData.time.length;
          dataIndex = 0;

          const LightweightCharts = require('lightweight-charts');
          const chart = LightweightCharts.createChart(document.getElementById('root'), {
            width: 1000,
            height: 600,

            layout: {
              backgroundColor: '#000000',
              textColor: 'rgba(255, 255, 255, 0.9)',
            },
            grid: {
              vertLines: {
                color: 'rgba(197, 203, 206, 0.5)',
              },
              horzLines: {
                color: 'rgba(197, 203, 206, 0.5)',
              },
            },
            crosshair: {
              mode: LightweightCharts.CrosshairMode.Normal,
            },
            rightPriceScale: {
              borderColor: 'rgba(197, 203, 206, 0.8)',
            },
            timeScale: {
              timeVisible: true,
              borderColor: 'rgba(197, 203, 206, 0.8)',
              rightOffset: 50,
              barSpacing: 10,
              fixLeftEdge: true,
              lockVisibleTimeRangeOnResize: true,
              rightBarStaysOnScroll: true,
              borderVisible: true,

              visible: true,

              secondsVisible: true,
            },
          });

          const candleSeries = chart.addCandlestickSeries({
            upColor: 'rgba(255, 144, 0, 1)',
            downColor: '#000',
            borderDownColor: 'rgba(255, 144, 0, 1)',
            borderUpColor: 'rgba(255, 144, 0, 1)',
            wickDownColor: 'rgba(255, 144, 0, 1)',
            wickUpColor: 'rgba(255, 144, 0, 1)',
          });

          if(chartPresent){
            candleSeries.setData([]);
            setChartPresent(false);
          }

          const initData = [
            { time: 1618574549, open: 54.62, high: 55.50, low: 54.52, close: 54.90 },
            { time: 1618574550, open: 55.08, high: 55.27, low: 54.61, close: 54.98 },
            { time: 1618574551, open: 56.09, high: 57.47, low: 56.09, close: 57.21 },
            { time: 1618574552, open: 57.00, high: 58.44, low: 56.41, close: 57.42 },
            { time: 1618574553, open: 57.46, high: 57.63, low: 56.17, close: 56.43 },
            { time: 1618574554, open: 56.26, high: 56.62, low: 55.19, close: 55.51 },
            { time: 1618574555, open: 55.81, high: 57.15, low: 55.72, close: 56.48 },
            { time: 1618574556, open: 56.92, high: 58.80, low: 56.92, close: 58.18 },
            { time: 1618574557, open: 58.32, high: 58.32, low: 56.76, close: 57.09 },
            { time: 1618574558, open: 56.98, high: 57.28, low: 55.55, close: 56.05 },
            { time: 1618574559, open: 56.34, high: 57.08, low: 55.92, close: 56.63 }
          ];

          //candleSeries.setData([]);

          setInterval(function () {
            if ((dataIndex < dataIndexLen)) {
              console.log(dataIndex);
              console.log(dataIndexLen);
              console.log(timeList[dataIndex]);
              console.log(priceList[dataIndex]);
              candleSeries.update({ time: timeList[dataIndex], open: priceList[dataIndex], high: priceList[dataIndex], low: priceList[dataIndex], close: priceList[dataIndex] });
              dataIndex++;
            }
          }, 200);
          setChartPresent(true);
        })
        .catch((err) => {
          console.log(err);
        });

    }
  };

  return (
    <div>
      <Form noValidate validated={validatedForm} onSubmit={handleSubmit}>
        <Form.Group controlId="date">
          <Form.Label>Enter a simulation date:</Form.Label>
          <Form.Control
            type="date"
            placeholder="Enter a simulation date:"
            onChange={(e: any) => {
              setFormData({ ...formData, date: e.target.value });
            }}
            value={formData.date}
            required
          ></Form.Control>
        </Form.Group>
        <Button type="submit" className="btn-block mt-2">Submit</Button>
      </Form>
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