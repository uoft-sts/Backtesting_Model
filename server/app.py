from flask import Flask, request, redirect, render_template, jsonify, json
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
from flask_cors import CORS
from apply_strategy import *
import datetime as dt

matplotlib.use('Agg')

UPLOAD_FOLDER = './data/'
app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['CORS_HEADERS'] = 'Content-Type'
@app.route('/result/', methods=['POST'])
def result():
    content = request.values
    daterange_from = content['daterange_from']
    daterange_to = content['daterange_to']
    underlying = content['underlying']
    expmonth = content['expMonth']
    methods = content['methods']

    input_path = './data/'
    output_path = './data/'
    output_csv_path = './sample.csv'
    #f_name = []
    
    #f = request.form.get('file')
        
    #f.save(secure_filename(f.filename))
    #f.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename)))          
    #f_name.append(f.filename)

    set_index(input_path, output_path)
    if methods == "First Of Month":
        a = Roll_Dates_First_Of_Month(underlying, expmonth, 
                        input_file_path = input_path,
                        output_file_path = output_csv_path)
    elif methods == "Last Trading Day":
        a = Roll_Dates_Last_Trading_Day(underlying, expmonth, 
                        input_file_path = input_path,
                        output_file_path = output_csv_path)
    elif methods == "Liquidity Based":
        a = Roll_Dates_Liquidity_Based(underlying, expmonth, 
                        input_file_path = input_path,
                        output_file_path = output_csv_path)
    df = a.expiration_filter()
    df_ = a.fit_transform(df)
    df_ = df_.loc[daterange_from:daterange_to]
    
    df_["time"] = df_.index
    df_['time'] = pd.to_datetime(df_['time'])
    df_ohlc = df_[["time", "open", "high", "low", "close"]]
    list_ohlc = df_ohlc.values.tolist()
    df_close = df_[["time", "close"]]
    list_close = df_close.values.tolist()
    
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

    # Creating DF & Dictionary for every strategy
    df_price_ema = ema_execution(df_)
    performance_summ_ema = performance_result(df_, df_price_ema,'EMA')
    df_['EMA_Buy_Signal_Price'] = df_price_ema[0]
    df_['EMA_Sell_Signal_Price'] = df_price_ema[1]
    df_ema_buy = df_[df_['EMA_Buy_Signal_Price'].notna()]
    df_ema_sell = df_[df_['EMA_Sell_Signal_Price'].notna()]
    df_ema_buy_clean = df_ema_buy[["time", "EMA_Buy_Signal_Price"]] # keep 3 columns we want
    list_ema_buy = df_ema_buy_clean.values.tolist()
    df_ema_sell_clean = df_ema_sell[["time", "EMA_Sell_Signal_Price"]]
    list_ema_sell = df_ema_sell_clean.values.tolist()

    df_price_tema = tema_execution(df_)
    performance_summ_tema = performance_result(df_, df_price_tema,'TEMA')
    df_['TEMA_Buy_Signal_Price'] = df_price_tema[0]
    df_['TEMA_Sell_Signal_Price'] = df_price_tema[1]
    df_tema_buy = df_[df_['TEMA_Buy_Signal_Price'].notna()]
    df_tema_sell = df_[df_['TEMA_Sell_Signal_Price'].notna()]
    df_tema_buy_clean = df_tema_buy[["time", "TEMA_Buy_Signal_Price"]] # keep 3 columns we want
    list_tema_buy = df_tema_buy_clean.values.tolist()
    df_tema_sell_clean = df_tema_sell[["time", "TEMA_Sell_Signal_Price"]]
    list_tema_sell = df_tema_sell_clean.values.tolist()

    df_price_macd = macd_execution(df_)
    performance_summ_macd = performance_result(df_, df_price_macd,'MACD')
    df_['MACD_Buy_Signal_Price'] = df_price_macd[0]
    df_['MACD_Sell_Signal_Price'] = df_price_macd[1]
    df_macd_buy = df_[df_['MACD_Buy_Signal_Price'].notna()]
    df_macd_sell = df_[df_['MACD_Sell_Signal_Price'].notna()]
    df_macd_buy_clean = df_macd_buy[["time", "MACD_Buy_Signal_Price"]] # keep 3 columns we want
    list_macd_buy = df_macd_buy_clean.values.tolist()
    df_macd_sell_clean = df_macd_sell[["time", "MACD_Sell_Signal_Price"]]
    list_macd_sell = df_macd_sell_clean.values.tolist()

    # Concatenating strategy DF into one big DF
    data = {}
    data["EMA"] = performance_summ_ema
    data["TEMA"] = performance_summ_tema
    data["MACD"] = performance_summ_macd
    data["OHLC"] = list_ohlc
    data["Close"] = list_close
    data["EMA_buy"] = list_ema_buy
    data["EMA_sell"] = list_ema_sell
    data["TEMA_buy"] = list_tema_buy
    data["TEMA_sell"] = list_tema_sell
    data["MACD_buy"] = list_macd_buy
    data["MACD_sell"] = list_macd_sell
    #print(data)
    return data           

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)