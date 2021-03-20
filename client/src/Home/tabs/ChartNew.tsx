import React,{ FunctionComponent,useEffect, useState,Component,useRef} from 'react';
import { createChart } from 'lightweight-charts';

function ChartNew(){
    const ref = useRef(null);;
    let LightweightCharts;

    useEffect(()=> {
        LightweightCharts = require('lightweight-charts');
        const { createChart } = LightweightCharts;
        var chart = LightweightCharts.createChart(document.body, {
          width: 1200,
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
          {time: 497493,open:"12.75",close:"13.01",high:"13.06",low:"12.7"},
          {time: 497593,open:"15.75",close:"13.01",high:"13.06",low:"12.7"},
          {time: 497693,open:"13.75",close:"13.01",high:"13.06",low:"12.7"},
          {time: 497793,open:"11.75",close:"13.01",high:"13.06",low:"12.7"},
          {time: 497893,open:"10.75",close:"13.01",high:"13.06",low:"12.7"},
        ]);


    },[]);

    return (
        <>
          <div ref={ref} />
        </>
      );
}

export default ChartNew;

    







