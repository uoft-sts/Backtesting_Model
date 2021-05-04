import React,{ FunctionComponent,useEffect, useState,Component} from 'react';
import ChartNew from './ChartNew';
import Level2 from './Level2';

import TimeNSales from './TimeNSales';

class Simulation extends Component{
    
    render(){
        
        
        return(
            <div>
                <TimeNSales />
                <Level2 />
                <ChartNew />

            </div>
        )

        
    }
}

export default Simulation;