import { FunctionComponent, useEffect, useState } from 'react';
import axios from "axios";

const Candlestick: FunctionComponent = () => {

    let loading = true;
    let dataIndex = 0;
    let dataIndexLen = 0;
    let timeList: number[] = [];
    let priceList: number[] = [];

    const getData = () => {
        axios({
            method: "get",
            url: "http://127.0.0.1:5000/simulation/",
        }).then(response => {
            const tempData = response.data;
            console.log(tempData.time);
            console.log(tempData.price);
            console.log(tempData.time.length);
            timeList = tempData.time;
            priceList = tempData.price;
            dataIndexLen = tempData.time.length;
            dataIndex = 0;
            loading = false;
        })
    }

    useEffect(() => {
        if (loading) {
            getChart();
            getData();
        }
    }, [])

    const getChart = () => {
        const LightweightCharts = require('lightweight-charts');
        const chart = LightweightCharts.createChart(document.getElementById('root'), {
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

        const candleSeries = chart.addCandlestickSeries({
            upColor: 'rgba(255, 144, 0, 1)',
            downColor: '#000',
            borderDownColor: 'rgba(255, 144, 0, 1)',
            borderUpColor: 'rgba(255, 144, 0, 1)',
            wickDownColor: 'rgba(255, 144, 0, 1)',
            wickUpColor: 'rgba(255, 144, 0, 1)',
        });

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

        candleSeries.setData([]);

        // var lastClose = data[data.length - 1].close;
        // var lastIndex = data.length - 1;

        // var targetIndex = lastIndex + 105 + Math.round(Math.random() + 30);
        // var targetPrice = getRandomPrice();

        // var currentIndex = lastIndex + 1;
        // var currentBusinessDay = { day: 29, month: 5, year: 2019 };
        // var ticksInCurrentBar = 0;
        // var currentBar = {
        //   open: 0,
        //   high: 0,
        //   low: 0,
        //   close: 0,
        //   time: currentBusinessDay,
        // };

        // function mergeTickToBar(price:number) {
        //   if (currentBar.open === null) {
        //     currentBar.open = price;
        //     currentBar.high = price;
        //     currentBar.low = price;
        //     currentBar.close = price;
        //   } else {
        //     currentBar.close = price;
        //     currentBar.high = Math.max(currentBar.high, price);
        //     currentBar.low = Math.min(currentBar.low, price);
        //   }
        //   candleSeries.update(currentBar);
        // }

        // function reset() {
        //   candleSeries.setData(data);
        //   lastClose = data[data.length - 1].close;
        //   lastIndex = data.length - 1;

        //   targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
        //   targetPrice = getRandomPrice();

        //   currentIndex = lastIndex + 1;
        //   currentBusinessDay = { day: 29, month: 5, year: 2019 };
        //   ticksInCurrentBar = 0;
        // }

        // function getRandomPrice() {
        //   return 10 + Math.round(Math.random() * 10000) / 100;
        // }

        // function nextBusinessDay(time:any) {
        //   var d = new Date();
        //   d.setUTCFullYear(time.year);
        //   d.setUTCMonth(time.month - 1);
        //   d.setUTCDate(time.day + 1);
        //   d.setUTCHours(0, 0, 0, 0);
        //   return {
        //     year: d.getUTCFullYear(),
        //     month: d.getUTCMonth() + 1,
        //     day: d.getUTCDate(),
        //   };
        // }

        setInterval(function () {
            if (!loading && (dataIndex < dataIndexLen)) {
                console.log(dataIndex);
                console.log(dataIndexLen);
                console.log(timeList[dataIndex]);
                console.log(priceList[dataIndex]);
                candleSeries.update({ time: timeList[dataIndex], open: priceList[dataIndex], high: priceList[dataIndex], low: priceList[dataIndex], close: priceList[dataIndex] });
                dataIndex++;
            }
            // var deltaY = targetPrice - lastClose;
            // var deltaX = targetIndex - lastIndex;
            // var angle = deltaY / deltaX;
            // var basePrice = lastClose + (currentIndex - lastIndex) * angle;
            // var noise = (0.1 - Math.random() * 0.2) + 1.0;
            // var noisedPrice = basePrice * noise;
            // mergeTickToBar(noisedPrice);
            // if (++ticksInCurrentBar === 5) {
            //   // move to next bar
            //   currentIndex++;
            //   currentBusinessDay = nextBusinessDay(currentBusinessDay);
            //   currentBar = {
            //     open: 0,
            //     high: 0,
            //     low: 0,
            //     close: 0,
            //     time: currentBusinessDay,
            //   };
            //   ticksInCurrentBar = 0;
            //   if (currentIndex === 5000) {
            //     reset();
            //     return;
            //   }
            //   if (currentIndex === targetIndex) {
            //     // change trend
            //     lastClose = noisedPrice;
            //     lastIndex = currentIndex;
            //     targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
            //     targetPrice = getRandomPrice();
            //   }
            // }
        }, 200);
    }

    return (
        <div>


        </div>
    );
}

export default Candlestick;