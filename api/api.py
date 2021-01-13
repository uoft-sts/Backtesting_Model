from flask import Flask, request, redirect, render_template
from index_setter import set_index
from werkzeug.utils import secure_filename
from file_reader import File_Reader, Roll_Dates_First_Of_Month, Roll_Dates_Last_Trading_Day, Roll_Dates_Liquidity_Based
from record import execution
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
import numpy as np
matplotlib.use('Agg')

UPLOAD_FOLDER = './data/'
app = Flask(__name__, static_folder='./templates/static')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
@app.route('/result', methods=['GET', 'POST'])
def result():
    daterange_from = request.form.get('daterange_from')
    daterange_to = request.form.get('daterange_to')
    underlying = request.form.get('underlying')
    expmonth = request.form.get('expmonth')
    method = request.form.get('method')
    input_path = '/Users/kev/Documents/GitHub/Backtesting_Model/api/data/'
    output_path = '/Users/kev/Documents/GitHub/Backtesting_Model/api/data/'
    if 'file' in request.files:
        f = request.files.get('file')
        f_name = []
        for f in request.files.getlist('file'):
            #f.save(secure_filename(f.filename))
            f.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename)))          
            f_name.append(f.filename)
            set_index(input_path, output_path)
            if method == "First Of Month":
                a = Roll_Dates_First_Of_Month(underlying, expmonth, 
                              input_file_path = '/Users/kev/Documents/GitHub/Backtesting_Model/api/data/',
                              output_file_path = '/Users/kev/Desktop/sample.csv')
            elif method == "Last Trading Day":
                a = Roll_Dates_Last_Trading_Day(underlying, expmonth, 
                              input_file_path = '/Users/kev/Documents/GitHub/Backtesting_Model/api/data/',
                              output_file_path = '/Users/kev/Desktop/sample.csv')
            elif method == "Liquidity Based":
                a = Roll_Dates_Liquidity_Based(underlying, expmonth, 
                              input_file_path = '/Users/kev/Documents/GitHub/Backtesting_Model/api/data/',
                              output_file_path = '/Users/kev/Desktop/sample.csv')
            df = a.expiration_filter()
            #print(df)
            df_ = a.fit_transform(df)
            df_ = df_.loc[daterange_from:daterange_to]
            
            
            EMA_short = ta.EMA(df_['close'], timeperiod = 5)
            EMA_long = ta.EMA(df_['close'], timeperiod = 20)
            
            df_['EMA_short'] = EMA_short
            df_['EMA_long'] = EMA_long
            
            df_price = execution(df_)
            df_['Buy_Signal_Price'] = df_price[0]
            df_['Sell_Signal_Price'] = df_price[1]
            
            print(df_)
            
            fig = plt.figure(figsize = (15, 7))
            plt.scatter(df_.index, df_['Buy_Signal_Price'], color = 'green', label = 'Buy', marker = '^', alpha = 0.6)
            plt.scatter(df_.index, df_['Sell_Signal_Price'], color = 'red', label = 'Sell', marker = 'v', alpha = 0.6)
            plt.plot(df_['close'], label = 'close', alpha = 0.4)
            plt.title('AAPL Chaikin A/D Oscillator Line')
            plt.legend(loc = 'best')
            plt.xlabel('Date')
            plt.ylabel('ADOSC Value')

            fig.savefig('./templates/static/temp.png', dpi=fig.dpi)
            #with open(os.path.join("./data/", f.filename)) as csv_file:
            #    reader = csv.reader(csv_file)
            data = []
            for i in range(len(df_)):
                if not math.isnan(df_.iloc[i]["Buy_Signal_Price"]) or not math.isnan(df_.iloc[i]["Sell_Signal_Price"]):
                    print(df_.index.date[i], df_.iloc[i]["Buy_Signal_Price"], df_.iloc[i]["Sell_Signal_Price"])
                    data.append([df_.index.date[i], df_.iloc[i]["Buy_Signal_Price"], df_.iloc[i]["Sell_Signal_Price"]])
            
            good_data = []
            # np.where to vectorizely calculate
            '''
            if math.isnan(data[0][1]):
                del data[0]
            if math.isnan(data[-1][2]):
                del data[-1]

            arr = np.arange(len(data))
            #using vector to separate buy and sell, then we can use mysql to merge

            Buy_data_arr=data[arr % 2 ==0]
            Sell_data_arr=data[arr % 2 !==0]
            good_data_arr = np.concatenate([But_data_arr,Sell_data_arr],axis=1)

            record_df = pd.DataFrame(good_data_arr, 
                  columns =['Entry_Date', 'Entry_Price', 'Exit_Price', 'Exit_Date', "Percentage_Change", "Long/Short"]) 
                  
            #then print(record_df) and keep going
            '''
            # C_arr = np.asarray(C) to translate list to array
            for i in range(len(data)):
                if i != len(data) - 1 and not math.isnan(data[i][1]):
                    pair = [data[i][0], data[i][1]]
                    pair.append(data[i+1][2])
                    pair.append(data[i+1][0])
                    change = (data[i+1][2] - data[i][1])/data[i][1]
                    pair.append(change)
                    pair.append("Long")
                    good_data.append(pair)
            
            record_df = pd.DataFrame(good_data, 
                  columns =['Entry_Date', 'Entry_Price', 'Exit_Price', 'Exit_Date', "Percentage_Change", "Long/Short"]) 
            print(record_df)
            record_df.to_csv('/Users/kev/Desktop/trade_record.csv', encoding = 'utf-8', sep = ',', header = True,
                      index = True)
            
            # Ratios
            ret_all_trade = record_df['Percentage_Change']
            
            # Cummulative return
            cum_ret = 0
            #added by Jon, a vectorization way to get the sum
            #ret_all_trade_arr = np.asarray(ret_all_trade)
            #cum_ret_arr = ret_all_trade_arr.sum
            for i in range(len(ret_all_trade)):
                cum_ret += ret_all_trade[i]
            
            # Annual Return
            ann_ret = cum_ret/365*240
            
            # Win Percentage
            win = 0
            loss = 0
            '''
            win_arr = (ret_all_trade_arr > 0).sum()
            loss_arr = (ret_all_trade_arr !> 0).sum()
            
            '''
            for i in range(len(ret_all_trade)):
                if ret_all_trade[i] > 0:
                    win+=1
                else:
                    loss+=1
            win_percent = win/len(ret_all_trade)
            
            # Win/Loss Ratio
            win_loss_ratio = win/loss
            
            # Beta
            
            # Volatility
            n = len(ret_all_trade)
            vol = np.std(ret_all_trade)*math.sqrt(n-1)/math.sqrt(n)
            
            # Annual volatility
            ann_vol = math.sqrt(252)*vol
            
            # Sharpe Ratio, default risk-free interest rate is 4%
            risk_free = 0.04
            excess_return = ann_ret - risk_free
            sharpe = excess_return/ann_ret
            
            print(ret_all_trade)
            print("Cumulative Return: ", round(cum_ret,4))
            print("Annual Return: ", round(ann_ret, 4))
            print("Win Percentage: ", win_percent)
            print("Win Loss Ratio: ", win_loss_ratio)
            print("Volatility", round(vol, 4))
            print("Annual Volatility: ", round(ann_vol, 4))
            print("Sharpe Ratio: ", round(sharpe, 4))
            d=[]
            d.append(["Cumulative Return", round(cum_ret,4)])
            d.append(["Annual Return", round(ann_ret, 4)])
            d.append(["Win Percentage", win_percent])
            d.append(["Win Loss Ratio", win_loss_ratio])
            d.append(["Volatility", round(vol, 4)])
            d.append(["Annual Volatility", round(ann_vol, 4)])
            d.append(["Sharpe Ratio", round(sharpe, 4)])
        files = glob.glob(os.path.join(input_path, "*.csv"))
        for f in files:
            os.remove(f)
    return render_template("dashboard.html", data=d)            
    return '''<h1>Underlying: {}</h1>
            <h1>Expiration Month: {}</h1>
            <h1>Method: {}</h1>
            <h1>Date starts at: {}</h1>
            <h1>Date ends at: {}</h1>
            <h1>Files: {}</h1>'''.format(underlying, expmonth, method, daterange_from, daterange_to, f_name)


@app.route("/")
def index():
    return render_template("index.html")


@app.route('/time')
def get_current_time():
    return {'time': time.time()}

if __name__ == "__main__":
    app.run()
