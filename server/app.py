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

    # Creating DF & Dictionary for every strategy
    df_price_ema = ema_execution(df_)
    performance_summ_ema = performance_result(df_, df_price_ema,'EMA')

    df_price_tema = tema_execution(df_)
    performance_summ_tema = performance_result(df_, df_price_tema,'TEMA')

    df_price_macd = macd_execution(df_)
    performance_summ_macd = performance_result(df_, df_price_macd,'MACD')

    # Concatenating strategy DF into one big DF
    data = {}
    data["EMA"] = performance_summ_ema
    data["TEMA"] = performance_summ_tema
    data["MACD"] = performance_summ_macd
    #print(data)
    return data           

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)