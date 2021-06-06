import { FunctionComponent,useEffect, useState, useRef } from 'react';
import axios from "axios";

type simulationProps = {
  date: string;
}

const Simulation:FunctionComponent<simulationProps> = (props) => {

    const ref = useRef(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [dataIndexLen, setDataIndexLen] = useState<number>(0);
    const [timeList, setTimeList] = useState<number[]>([]);
    const [priceList, setPriceList] = useState<number[]>([]);
    const [candleSeries, setCandleSeries] = useState<any>(null);
    const [timerPool,setTimePool] = useState<any[]>([]);

    const getData = () => {
      if(props.date !== ''){
        timerPool.forEach((data)=> {         
          window.clearTimeout(data);
        })
        setTimePool([]);
        axios({
          method: "get",
          url: `http://127.0.0.1:5000/simulation?date=${props.date}`,
        }).then(async response => {
          const tempData = response.data;
          console.log(tempData.time);
          console.log(tempData.price);
          console.log(tempData.time.length);
          setTimeList(tempData.time);
          setPriceList(tempData.price);
          setDataIndexLen(tempData.time.length);
          candleSeries.setData([]);
          for(let i=0;i<dataIndexLen;i++){
            ((i:number)=>{
              const timeNum = setTimeout(() => {  
              candleSeries.update({ time: timeList[i], open: priceList[i], high: priceList[i], low: priceList[i], close: priceList[i]});
              console.log("break "+i); 
            }, (i + 1) * 1000);
            timerPool.push(timeNum);
            setTimePool(timerPool);
            })(i)
          }
        })
      }
    }

    useEffect(()=>{
      getData();
    },[props.date])

    useEffect(()=>{
      if(loading){
        getChart();
        setLoading(false);
      }
    },[])
    
     const getChart = () => {
      const LightweightCharts = require('lightweight-charts');
      const chart = LightweightCharts.createChart(document.body, {
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
      
      const candleSeriesTemp = chart.addCandlestickSeries({
        upColor: 'rgba(255, 144, 0, 1)',
        downColor: '#000',
        borderDownColor: 'rgba(255, 144, 0, 1)',
        borderUpColor: 'rgba(255, 144, 0, 1)',
        wickDownColor: 'rgba(255, 144, 0, 1)',
        wickUpColor: 'rgba(255, 144, 0, 1)',
      });

      const initData = [
        { time: 1618574549, open: 54.62, high: 55.50, low: 54.52, close: 54.90 },
      ];
      
      candleSeriesTemp.setData([]);

      setCandleSeries(candleSeriesTemp); 
  }

    return (
      <div ref={ref}/>
    );
}

export default Simulation;