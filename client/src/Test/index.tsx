import React, { FunctionComponent, useEffect, useState } from "react";
import { Form, Button, Row, Col, Table, Image, DropdownButton, Dropdown } from "react-bootstrap";
import axios from "axios";
import Chart from "react-apexcharts";
// import EMAGraph from "../graph/EMA.png"
// import TEMAGraph from "../graph/TEMA.png"
// import MACDGraph from "../graph/MACD.png"
// import redarrow from '../image/redarrow.png'
// import greenarrow from '../image/greenarrow.png'

type submitDataType = {
  underlying: string;
  expMonth: string;
  methods: string;
  daterange_from: string;
  daterange_to: string;
};

type ratioDataType = {
  "Cumulative Return": number;
  "Annual return": number;
  "Win percentage": number;
  "Win loss ratio": number | string;
  "Volatility": number;
  "Annual volatility": number;
  "Sharpe ratio": number | string;
  "Sortino ratio": number | string;
  "Max drawdown": number;
  "Calmar ratio": number | string;
  "Omega ratio": number | string;
  "Skew": number;
  "Kurtosis": number;
  "Tail ratio": number;
  "VAR": number;
};

type responseDataType = {
  "EMA": ratioDataType;
  "TEMA": ratioDataType;
  "MACD": ratioDataType;
  "OHLC": number[];
  "Close": number[];
  "EMA_buy": number[];
  "EMA_sell": number[];
  "TEMA_buy": number[];
  "TEMA_sell": number[];
  "MACD_buy": number[];
  "MACD_sell": number[];
};

// Data Type for candlestick
type optionsDataType = {
  chart: chartDataType;
  title: titleDataType;
  xaxis: xaxisDataType;
  yaxis: yaxisDataType;
  tooltip?: tooltipDataType;
  markers?: markerDataType;
  fill?: fillDataType;
  colors?: string | string[];
};

type chartDataType = {
  id?: string;
  type?: string;
  height?: number;
};

type titleDataType = {
  text?: string;
  align?: string;
};

type xaxisDataType = {
  categories?: number[];
  type?: string;
  labels?: labelDataType;
};

type labelDataType = {
  format?: string;
}

type yaxisDataType = {
  tooltip?: tooltipDataType;
};

type tooltipDataType = {
  enabled?: boolean;
  x?: labelDataType;
  y?: labelDataType;
  shared?: boolean;
  intersect?: boolean;
};

type markerDataType = {
  size: number[];
  shape?: string;
  colors?: string[] | string;
};

type seriesDataType = {
  name: string;
  data: number[] | number[][];
  type?: string;
};

type fillDataType = {
  type: string | string[];
  opacity?: number;
  image?: imageDataType;
  colors?: string[] | string;
};

type imageDataType = {
  src: string | string[];
  width?: number;
  height?: number;
};


const Test: FunctionComponent<any> = (props) => {
  const emptyData: submitDataType = {
    underlying: "",
    expMonth: "",
    methods: "",
    daterange_from: "",
    daterange_to: "",
  };

  const emptyRatio: ratioDataType = {
    "Cumulative Return": 0,
    "Annual return": 0,
    "Win percentage": 0,
    "Win loss ratio": 1,
    Volatility: 0,
    "Annual volatility": 0,
    "Sharpe ratio": 0,
    "Sortino ratio": 0,
    "Max drawdown": 0,
    "Calmar ratio": 0,
    "Omega ratio": 0,
    Skew: 0,
    Kurtosis: 0,
    "Tail ratio": 0,
    VAR: 0
  };

  const [validatedForm, setValidatedForm] = useState<boolean>(false);
  const [monthCheck, setMonthCheck] = useState<boolean>(false);
  const [formData, setFormData] = useState<submitDataType>(emptyData);
  const [tableHeader, setTableHeader] = useState<any>(<></>);
  const [tableRows, setTableRows] = useState<any>(<></>);
  const [showbutton, setShowButton] = useState<boolean>(true);
  //const [showGraph, setShowGraph] = useState<boolean>(false);
  const [showDropdownButton, setShowDropdownButton] = useState<boolean>(false);
  const [showCandlestick, setShowCandlestick] = useState<boolean>(false);
  const [showLine, setShowLine] = useState<boolean>(false);
  const [resData, setResData] = useState<responseDataType>({
    EMA: emptyRatio,
    TEMA: emptyRatio,
    MACD: emptyRatio,
    "OHLC": [],
    "Close": [],
    "EMA_buy": [],
    "EMA_sell": [],
    "TEMA_buy": [],
    "TEMA_sell": [],
    "MACD_buy": [],
    "MACD_sell": []
  });
  const [graphType, setGraphType] = useState<string>("");
  const [dropdownValue, setDropdownValue] = useState<string>("EMA");
  const [candlestickOptions, setCandlestickOptions] = useState<optionsDataType>({
    chart: {
      type: 'candlestick',
      height: 350
    },
    title: {
      text: 'CandleStick Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy'
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  })
  const [candlestickSeries, setCandlestickSeries] = useState<seriesDataType[]>(
    [{
      name: 'Statistic',
      data: []
    }]
  );
  const [lineOptions, setLineOptions] = useState<optionsDataType>({
    chart: {
      height: 350,
      type: 'line'
    },
    title: {
      text: 'Trading Record',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy'
      },
      shared: false,
      intersect: true,
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    },
    markers: {
      size: [0,6,6],
    },
    fill: {
      type: 'solid',
      
    },
    colors: ['#267CE3', '#22DB35', '#FF3F00']
  });

  const [lineSeries, setLineSeries] = useState<seriesDataType[]>(
    [{
      name: 'Line',
      type: "line",
      data: []
    },{
      name: 'Buy',
      type: "scatter",
      data: []
    },{
      name: 'Sell',
      type: "scatter",
      data: []
    }]
  );

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
          //setShowGraph(true);
          setShowDropdownButton(true);
          setShowCandlestick(true);
          setShowLine(true);
          let tempHeader = Object.keys(response.data[dropdownValue]).map((d) => <th>{d}</th>);
          let tempRows = Object.keys(response.data[dropdownValue]).map((d) => (
            <td>{response.data[dropdownValue][d]}</td>
          ));
          setGraphType("EMA");
          setResData(response.data);
          setTableHeader(tempHeader);
          setTableRows(tempRows);
          setCandlestickSeries([{
            name: 'Candlestick',
            data: response.data['OHLC']
          }]);
          setLineSeries([{
            name: 'Closing Price',
            type: 'line',
            data: response.data['Close']
          }, {
            name: 'Buy',
            type: 'scatter',
            data: response.data[dropdownValue+'_buy']
          }, {
            name: 'Sell',
            type: 'scatter',
            data: response.data[dropdownValue+'_sell']
          }]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSelect=(e:string | null)=>{
    console.log(e)
    var tempHeader;
    var tempRows;
    if(e === "EMA"){
      tempHeader = Object.keys(resData['EMA']).map((d) => <th>{d}</th>);
      tempRows = Object.keys(resData['EMA']).map((d) => (
        <td>{(resData['EMA'] as any)[d]}</td>
      ));
      setGraphType("EMA");
      setLineSeries([{
        name: 'Closing Price',
        type: 'line',
        data: resData['Close']
      }, {
        name: 'Buy',
        type: 'scatter',
        data: resData['EMA_buy']
      }, {
        name: 'Sell',
        type: 'scatter',
        data: resData['EMA_sell']
      }]);
      console.log(graphType);
    }
    else if(e === "TEMA"){
      tempHeader = Object.keys(resData['TEMA']).map((d) => <th>{d}</th>);
      tempRows = Object.keys(resData['TEMA']).map((d) => (
        <td>{(resData['TEMA'] as any)[d]}</td>
      ));
      setGraphType("TEMA");
      setLineSeries([{
        name: 'Closing Price',
        type: 'line',
        data: resData['Close']
      }, {
        name: 'Buy',
        type: 'scatter',
        data: resData['TEMA_buy']
      }, {
        name: 'Sell',
        type: 'scatter',
        data: resData['TEMA_sell']
      }]);
      console.log(graphType);
    } else {
      tempHeader = Object.keys(resData['MACD']).map((d) => <th>{d}</th>);
      tempRows = Object.keys(resData['MACD']).map((d) => (
        <td>{(resData['MACD'] as any)[d]}</td>
      ));
      setGraphType("MACD");
      setLineSeries([{
        name: 'Closing Price',
        type: 'line',
        data: resData['Close']
      }, {
        name: 'Buy',
        type: 'scatter',
        data: resData['MACD_buy']
      }, {
        name: 'Sell',
        type: 'scatter',
        data: resData['MACD_sell']
      }]);
      console.log(graphType);
    }
    setTableHeader(tempHeader);
    setTableRows(tempRows);
  }

  return (
    <div>
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
          <Button type="submit" className="btn-block mt-2">Submit form</Button>
        </Form>
      ) : (
        <></>
      )}
      <Button
        variant="outline-primary"
        onClick={() => {
          setShowButton(!showbutton);
        }}
        className="btn-block p-0 mt-3"
      >
        {showbutton ? "Hide Input Form" : "Show Input Form"}
      </Button>
      { showDropdownButton ? (
        <DropdownButton 
        id="dropdown-basic-button" 
        title={dropdownValue}
        onSelect={handleSelect}
        className="mt-4 mb-4">
          <Dropdown.Item eventKey="EMA" onClick={() => setDropdownValue("EMA")}>EMA</Dropdown.Item>
          <Dropdown.Item eventKey="TEMA" onClick={() => setDropdownValue("TEMA")}>TEMA</Dropdown.Item>
          <Dropdown.Item eventKey="MACD" onClick={() => setDropdownValue("MACD")}>MACD</Dropdown.Item>
        </DropdownButton>
      ) : (
        <></>
      )}

      <Table striped bordered hover responsive>
        <thead>
          <tr>{tableHeader}</tr>
        </thead>
        <tbody>
          <tr>{tableRows}</tr>
        </tbody>
      </Table>  

      { showLine ? (
        <Chart options={lineOptions} series={lineSeries} type="line" width={1100} height={500}/>
      ) : (
        <></>
      )}

      { showCandlestick ? (
        <Chart options={candlestickOptions} series={candlestickSeries} type="candlestick" width={1100} height={500}/>
      ) : (
        <></>
      )}

      {/* {(function() {
        if(showGraph) {
          if (graphType === "EMA") {
            console.log("here at ema");
            return <Image src={EMAGraph} key={Date.now()} onLoad={() => console.log("loaded at ema")} fluid/>;
          } else if (graphType === "TEMA") {
            console.log("here at tema");
            return <Image src={TEMAGraph} key={Date.now()} onLoad={() => console.log("loaded at tema")} fluid/>;
          } else {
            console.log("here at macd");
            return <Image src={MACDGraph} key={Date.now()} onLoad={() => console.log("loaded at macd")}  fluid/>
          }
        } else {
          return <></>;
        }    
      })()} */}
      
    </div>
  );
};

export default Test;
