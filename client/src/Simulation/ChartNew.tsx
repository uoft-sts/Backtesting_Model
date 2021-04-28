import React,{ FunctionComponent,useEffect, useState,Component,useRef} from 'react';
import { createChart } from 'lightweight-charts';

function ChartNew(){
    const ref = useRef(null);;
    let LightweightCharts;

    useEffect(()=> {
        LightweightCharts = require('lightweight-charts');
        const { createChart } = LightweightCharts;
        var chart = LightweightCharts.createChart(document.body, {
          width: 1000,
          height: 300,
          
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
        
        var candleSeries = chart.addCandlestickSeries({
          upColor: 'rgba(255, 144, 0, 1)',
          downColor: '#000',
          borderDownColor: 'rgba(255, 144, 0, 1)',
          borderUpColor: 'rgba(255, 144, 0, 1)',
          wickDownColor: 'rgba(255, 144, 0, 1)',
          wickUpColor: 'rgba(255, 144, 0, 1)',
        });
        
        candleSeries.setData([
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
        ]);




    },[]);

    return (
        <>
          <div ref={ref} />
        </>
      );
}

export default ChartNew;

    







