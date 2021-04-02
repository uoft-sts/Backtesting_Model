import React,{ FunctionComponent,useEffect, useState,Component} from 'react';
import ChartNew from './ChartNew';
import TimeNSales from './TimeNSales';

class Simulation extends Component{
    
    render(){
        
        
        return(
            <div>
                <TimeNSales />
                <ChartNew />
            </div>
        )

        
    }
}

export default Simulation;