import numpy as np
#import pandas_datareader as web
import pandas as pd
from datetime import datetime
from typing import List

# EMA
def execution(df):
    Buy = []
    Sell = []
    flag = -1 
    
    # flag = 1 (Long position) Flag = 0 (short Position) Flag = -1 (None)
    
    for i in range(0, len(df)):
        if df['EMA_short'][i] > df['EMA_long'][i]:
            Sell.append(np.nan)
            if flag != 1:
                Buy.append(df['close'][i])
                flag = 1
            else:
                Buy.append(np.nan)

        elif df['EMA_short'][i] < df['EMA_long'][i]:
            Buy.append(np.nan)
            if flag != 0:
                Sell.append(df['close'][i])
                flag = 0
            else:
                Sell.append(np.nan)

        else:
            Buy.append(np.nan)
            Sell.append(np.nan)

    return (Buy, Sell)
