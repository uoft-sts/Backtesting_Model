from flask import Flask, request, redirect, render_template 
from index_setter import set_index
from werkzeug.utils import secure_filename
from file_reader import File_Reader, Roll_Dates_First_Of_Month, Roll_Dates_Last_Trading_Day, Roll_Dates_Liquidity_Based
from record import ema_execution, tema_execution, macd_execution
from ratios import Portfolio
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import matplotlib
import time
import csv
import os
import logging
import glob
import talib as ta
import math
import pandas_datareader as web
from apply_strategy import *


matplotlib.use('Agg')

UPLOAD_FOLDER = './data/'
template_dir = os.path.abspath('../client/templates')
app = Flask(__name__, template_folder=template_dir)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
@app.route('/result', methods=['GET', 'POST'])
def result():
    daterange_from = request.form.get('daterange_from')
    print(daterange_from)
    daterange_to = request.form.get('daterange_to')
    underlying = request.form.get('underlying')
    expmonth = request.form.get('expmonth')
    method = request.form.get('method')
    input_path = './data/'
    output_csv_path = './sample.csv'
    #f_name = []
    
    #f = request.form.get('file')
        
    #f.save(secure_filename(f.filename))
    #f.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename)))          
    #f_name.append(f.filename)
    set_index(input_path, input_path)
    if method == "First Of Month":
        a = Roll_Dates_First_Of_Month(underlying, expmonth, 
                        input_file_path = input_path,
                        output_file_path = output_csv_path)
    elif method == "Last Trading Day":
        a = Roll_Dates_Last_Trading_Day(underlying, expmonth, 
                        input_file_path = input_path,
                        output_file_path = output_csv_path)
    elif method == "Liquidity Based":
        a = Roll_Dates_Liquidity_Based(underlying, expmonth, 
                        input_file_path = input_path,
                        output_file_path = output_csv_path)
    df = a.expiration_filter()
    #print(df)
    df_ = a.fit_transform(df)
    df_ = df_.loc[daterange_from:daterange_to]
    
    # Strategy EMA
    EMA_short = ta.EMA(df_['close'], timeperiod = 5)
    EMA_long = ta.EMA(df_['close'], timeperiod = 10)
    df_['EMA_short'] = EMA_short
    df_['EMA_long'] = EMA_long

    # TEMA
    TEMA_short = ta.TEMA(df_['close'], timeperiod = 20)
    TEMA_long = ta.TEMA(df_['close'], timeperiod = 50)
    df_['TEMA_short'] = TEMA_short
    df_['TEMA_long'] = TEMA_long
    
    # MACD
    shortEMA = df_.close.ewm(span = 12, adjust = False).mean()
    longEMA = df_.close.ewm(span = 26, adjust = False).mean()
    MACD = shortEMA - longEMA
    signal = MACD.ewm(span=9, adjust = False).mean()

    df_['MACD'] = MACD
    df_['Signal_line'] = signal

    df_price_ema = ema_execution(df_)
    performance_summ_ema = performance_result(df_, df_price_ema,'EMA')

    df_price_tema = tema_execution(df_)
    performance_summ_tema = performance_result(df_, df_price_tema,'TEMA')

    df_price_macd = macd_execution(df_)
    performance_summ_macd = performance_result(df_, df_price_macd,'MACD')





    # df_['Buy_Signal_Price'] = df_price[0]
    # df_['Sell_Signal_Price'] = df_price[1]
    
    # fig = plt.figure(figsize = (15, 7))
    # plt.scatter(df_.index, df_['Buy_Signal_Price'], color = 'green', label = 'Buy', marker = '^', alpha = 0.6)
    # plt.scatter(df_.index, df_['Sell_Signal_Price'], color = 'red', label = 'Sell', marker = 'v', alpha = 0.6)
    # plt.plot(df_['close'], label = 'close', alpha = 0.4)
    # plt.title('Backtesting')
    # plt.legend(loc = 'best')
    # plt.xlabel('Date')
    # plt.ylabel('Price')

    # fig.savefig('./static/temp.png', dpi=fig.dpi)
    
    # # Data Filtering
    # data = []
    # df_valid = df_[(df_['Buy_Signal_Price'].notna()) | (df_['Sell_Signal_Price'].notna())]
    # df_valid = df_valid[['Buy_Signal_Price','Sell_Signal_Price']] # keep 3 columns we want
    # data = df_valid.reset_index().values.tolist() # convert dataframe to list
    # if math.isnan(data[0][1]):
    #     del data[0]
    # if math.isnan(data[-1][2]):
    #     del data[-1]


    # # Concat buy + sell into one dataframe
    # data_arr = np.array(data)
    # arr = np.arange(len(data))
    # Buy_data_arr=data_arr[arr % 2 ==0]
    # Sell_data_arr=data_arr[arr % 2 == 1]
    # good_data_arr = np.concatenate([Buy_data_arr,Sell_data_arr],axis=1)
    # record_df = pd.DataFrame(good_data_arr, 
    #         columns =['Entry_Date', 'Entry_Price','Buy_data_nan', 'Exit_Date', 'Sell_data_nan', 'Exit_Price']) 
    # del record_df['Buy_data_nan']
    # del record_df['Sell_data_nan']

    # record_df['Entry_Date'] = pd.to_datetime(record_df['Entry_Date'], format='%Y%m%d')
    # record_df['Exit_Date'] = pd.to_datetime(record_df['Exit_Date'], format='%Y%m%d')
    
    # # helper for adding percentage change and long/short column into df
    # def percent_change(row):
    #     return (row['Exit_Price'] - row['Entry_Price'])/row['Entry_Price']
    # def set_long_short(row):
    #     return 'Long'
    
    # record_df['Percentage_Change'] = record_df.apply (lambda row: percent_change(row), axis=1)
    # record_df['Long/Short'] = record_df.apply (lambda row: set_long_short(row), axis=1)
    # record_df['P_L'] = record_df.Exit_Price.values - record_df.Entry_Price.values
    # print(record_df)
    # #record_df.to_csv(output_csv_path, encoding = 'utf-8', sep = ',', header = True,
    # #            index = True)

    # # Ratios

    # # initiate Portfolio class
    # portfolio = Portfolio(record_df, init_investment = 10000)

    # # market return
    # market = web.DataReader('SPY', data_source = 'yahoo', start = record_df.Entry_Date.iloc[0], end = record_df.Exit_Date.iloc[-1])
    # market_return = (market.Close.iloc[-1] - market.Close.iloc[0])/market.Close.iloc[0]
    # market_return = market_return.round(4)
    
    # Summarize Performance
    #performance_summ = portfolio.summarize_performance(market_return, 0.5)




    # stra_1的结果： 
# "ema":{"ratio1":321;"ratio2":2}

    data = {}
    data["EMA"] = performance_summ_ema
    data["TEMA"] = performance_summ_tema
    data["MACD"] = performance_summ_macd
    print(data)
    # data.append('ID#','strategy-1', 'EMA')
    # for key in performance_summ_ema:    
    #     idnum = 1
    #     data.append([idnum, key, performance_summ_ema[key]])
    #     idnum = idnum + 1
    # data.append('strategy-2', 'TEMA')
    # for key in performance_summ_tema:
    #     idnum = 1
    #     data.append([idnum, key, performance_summ_tema[key]])
    #     idnum = idnum + 1
    # data.append('strategy-3', 'MACD')
    # for key in performance_summ_macd:
    #     idnum = 1
    #     data.append([idnum, key, performance_summ_macd[key]])
    #     idnum = idnum + 1
    #files = glob.glob(os.path.join(input_path, "*.csv"))
    #for f in files:
    #    os.remove(f)
    return render_template("dashboard.html", data=data)            
    #return '''<h1>Underlying: {}</h1>
    #        <h1>Expiration Month: {}</h1>
    #        <h1>Method: {}</h1>
    #        <h1>Date starts at: {}</h1>
    #        <h1>Date ends at: {}</h1>'''.format(underlying, expmonth, method, daterange_from, daterange_to)


@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)