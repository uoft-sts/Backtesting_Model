import numpy as np
#import pandas_datareader as web
import pandas as pd
from datetime import datetime
from typing import List

# EMA
def ema_execution(df):
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



def tema_execution(df):
    Buy = []
    Sell = []
    flag = -1
    for i in range (len(df)):
        if df['TEMA_short'][i] > df['TEMA_long'][i]:
            Sell.append(np.nan)
            if flag != 1:
                Buy.append(df['close'][i])
                flag = 1
            else:
                Buy.append(np.nan)

        elif df['TEMA_short'][i] < df['TEMA_long'][i]:
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



def macd_execution(signal):
    Buy = []
    Sell = []
    flag = -1
    for i in range(0, len(signal)):
        if signal['MACD'][i] > signal['Signal_line'][i]:
            Sell.append(np.nan)
            if flag != 1:
                Buy.append(signal['close'][i])
                flag = 1
            else:
                Buy.append(np.nan)
        elif signal['MACD'][i] < signal['Signal_line'][i]:
            Buy.append(np.nan)
            if flag != 0:
                Sell.append(signal['close'][i])
                flag = 0
            else:
                Sell.append(np.nan)
        else:
            Buy.append(np.nan)
            Sell.append(np.nan)
    return (Buy, Sell)
