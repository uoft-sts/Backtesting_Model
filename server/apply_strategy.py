from ratios import Portfolio
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import matplotlib
import math
import pandas_datareader as web

def performance_result(df_, df_price, strategy_name):
    #前台传入的strategy name必须是要和对应strategy函数名相同

    df_['Buy_Signal_Price'] = df_price[0]
    df_['Sell_Signal_Price'] = df_price[1]
    
    fig = plt.figure(figsize = (15, 7))
    plt.scatter(df_.index, df_['Buy_Signal_Price'], color = 'green', label = 'Buy', marker = '^', alpha = 0.6)
    plt.scatter(df_.index, df_['Sell_Signal_Price'], color = 'red', label = 'Sell', marker = 'v', alpha = 0.6)
    plt.plot(df_['close'], label = 'close', alpha = 0.4)
    plt.title('Backtesting with ' + strategy_name)
    plt.legend(loc = 'best')
    plt.xlabel('Date')
    plt.ylabel('Price')

    
    fig.savefig('../client/src/graph/' + strategy_name + '.png', dpi=fig.dpi)
    
    # Data Filtering
    data = []
    df_valid = df_[(df_['Buy_Signal_Price'].notna()) | (df_['Sell_Signal_Price'].notna())]
    df_valid = df_valid[['Buy_Signal_Price','Sell_Signal_Price']] # keep 3 columns we want
    data = df_valid.reset_index().values.tolist() # convert dataframe to list
    if math.isnan(data[0][1]):
        del data[0]
    if math.isnan(data[-1][2]):
        del data[-1]


    # Concat buy + sell into one dataframe
    data_arr = np.array(data)
    arr = np.arange(len(data))
    Buy_data_arr=data_arr[arr % 2 ==0]
    Sell_data_arr=data_arr[arr % 2 == 1]
    good_data_arr = np.concatenate([Buy_data_arr,Sell_data_arr],axis=1)
    record_df = pd.DataFrame(good_data_arr, 
            columns =['Entry_Date', 'Entry_Price','Buy_data_nan', 'Exit_Date', 'Sell_data_nan', 'Exit_Price']) 
    del record_df['Buy_data_nan']
    del record_df['Sell_data_nan']

    record_df['Entry_Date'] = pd.to_datetime(record_df['Entry_Date'], format='%Y%m%d')
    record_df['Exit_Date'] = pd.to_datetime(record_df['Exit_Date'], format='%Y%m%d')
    
    # helper for adding percentage change and long/short column into df
    def percent_change(row):
        return (row['Exit_Price'] - row['Entry_Price'])/row['Entry_Price']
    def set_long_short(row):
        return 'Long'
    
    record_df['Percentage_Change'] = record_df.apply (lambda row: percent_change(row), axis=1)
    record_df['Long/Short'] = record_df.apply (lambda row: set_long_short(row), axis=1)
    record_df['P_L'] = record_df.Exit_Price.values - record_df.Entry_Price.values
    #print(record_df)
    #record_df.to_csv(output_csv_path, encoding = 'utf-8', sep = ',', header = True,
    #            index = True)

    # Ratios

    # initiate Portfolio class
    portfolio = Portfolio(record_df, init_investment = 10000)

    # market return
    market = web.DataReader('SPY', data_source = 'yahoo', start = record_df.Entry_Date.iloc[0], end = record_df.Exit_Date.iloc[-1])
    market_return = (market.Close.iloc[-1] - market.Close.iloc[0])/market.Close.iloc[0]
    market_return = market_return.round(4)
    
    # Summarize Performance
    performance_summ = portfolio.summarize_performance(market_return, 0.5)

    return performance_summ
