import React,{ FunctionComponent,useEffect, useState} from 'react';
import { Card, Button } from "react-bootstrap";
import applelogo from "../image/apple.jpg";
import axios from "axios";
import Plot from "react-plotly.js";

// type listDataType = {
//     ticker?: string,
//     price?: number,
//     change?: number
// };

const Home:FunctionComponent<any> = (props) => {
    // const [list, setList] = useState<listDataType[]>([]);
    // useEffect(() => {
    //     fetch('http://127.0.0.1:5000/home/stocks/', {
    //         method: 'GET', 
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     }).then(res => res.json()).then(data => {
    //       setList(data);
    //       console.log(data)
    //     });
    //   }, []);

    return (
        // <div>
        // {list.map((item) => (
        //     <Card style={{ width: '18rem' }}>
        //         <Card.Body>
        //             <Card.Title>{item.ticker}</Card.Title>
        //             <Card.Text>
        //                 Price: {item.price}
        //             </Card.Text>
        //             <Card.Text>
        //                 Change: {item.change}
        //             </Card.Text>
        //         </Card.Body>
        //     </Card>
        // ))}
        // </div>
        <div>
            <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
        ]}
        layout={ {width: 800, height: 400, title: 'A Fancy Plot'} }
        config={{ scrollZoom: true }}
      />
        </div>
        
    );
}

export default Home;