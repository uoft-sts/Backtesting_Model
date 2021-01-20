import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import os

#Step 1: Obtain all the selected files according to ticker and expiration date/month

#Roll_Dates_First_Of_Month Debug Start
#initial variables
underlying = 'a'
contract_exp = '01'
input_file_path = '/Users/liguolun/Desktop/Stock_Trader_Society/China_Future_Data/Chinse_Futures_1d/'
output_file_path = '/Users/liguolun/Desktop/Stock_Trader_Society/China_Future_Data/1d_Processed/A01.csv'
underlying_filters = True
expiration_filters = True

# Store variables
underlying = str.upper(underlying)
contract_exp = contract_exp
file_path = input_file_path
output_file_path = output_file_path
underlying_filters = underlying_filters
expiration_filters = expiration_filters
        
import copy
# Add additional info to each dataframe
def add_info(file_df):
    file_df2 = copy.copy(file_df)
    file_df2['Ticker'] = file_df2.File_Name.apply(lambda file_name: file_name.split('.')[0]) #ticker of this contract
    file_df2['Exp_day'] = file_df2.Ticker.str.extract('(\d+)') #expiration date, e.g. 1704 means 2017-04
    file_df2['Underlying'] = file_df2.Ticker.apply(lambda name: name[:-4]) #abbreviation code of the underlying asset
    return file_df2
file_df = add_info(file_df)
file_df = pd.DataFrame({'File_Name': os.listdir(input_file_path)}, dtype='object')

def filter():
    if underlying_filters: # Filter underlying product
        exp_df = file_df[file_df.Underlying == underlying]
    if expiration_filters: # Filter contract expiration day
        exp_df['Exp_Month'] = exp_df.Exp_day.apply(lambda exp: exp[2:])
        exp_df = exp_df[exp_df.Exp_Month == contract_exp]
    return exp_df

df2 = filter()
#sort by expiration date
df2 = df2.sort_values('Exp_day')

#Step 2: process all selected files inside the directory, store them in a list/array
def process_df(f:str): 
    df = pd.read_csv(file_path + f,encoding = 'utf-8', sep = ',')
#     df.replace('', np.nan, inplace = True)
    df.dropna(how = 'any', inplace = True)
    df = df[df.Time.notnull()]
    df['Time'] = np.array(df.Time.values, dtype = 'datetime64[D]')
    return df
all_df = df2.File_Name.apply(process_df).values 

#Step 3: For each df, Get rolling dates as a function of time range

#get the time range of all dataframes
all_timeind = [df.Time.values.astype('datetime64[D]') for df in all_df] #need to convert to day, otherwise unit will be ns

#3.1:get all the Last Trading Days as Roll Dates, further obtain the starting dates and ending dates
all_rolldates = [timeind[-1] for timeind in all_timeind[:-1]]
#start dates are one day behind roll dates
all_startdates = [all_timeind[0][0]] + [np.timedelta64(1,'D') + rolldate for rolldate in all_rolldates[:]] 
all_enddates = all_rolldates + [all_timeind[-1][-1]]

#3.2:get the First Trading Day of Each Expiration Month

#Step 4: Use start and end dates to filter all dataframes, and get all starting and ending prices
all_df2 = [df[(df.Time >= all_startdates[i]) & (df.Time <= all_enddates[i])].set_index('Time') for i,df in enumerate(all_df)]
all_startprices = [df.iloc[0,:].open for df in all_df2] #start prices are determined by open prices
all_endprices = [df.iloc[-1,:].close for df in all_df2] #close prices are determined by close prices

#Step 5: Calculate all adjustments, and adjust the prices

#5.1: Forward multiplier adjustment
rel_multipliers = np.divide(np.array(all_endprices[:-1]),np.array(all_startprices[1:])) #the relative price change
cum_multipliers = np.cumprod(rel_multipliers) #the true multiplier that should be applied to each dataframe
price_cols = ['open', 'high', 'low', 'close','avg','pre_close'] #adjust only the price columns
all_adj_df1 = [all_df2[0].loc[:,price_cols]] + [df.loc[:,price_cols].apply(lambda x,i=i: x*cum_multipliers[i]) for i, df in enumerate(all_df2[1:])]

#5.2: Backward multiplier adjustment
rel_multipliers = np.divide(np.array(all_endprices[:-1]), np.array(all_startprices[1:])) #the relative price change
cum_dividers = np.cumprod(rel_multipliers[::-1])[::-1] #dividers that should be applied to each dataframe
price_cols = ['open', 'high', 'low', 'close','avg','pre_close'] #adjust only the price columns
all_adj_df2 = [df.loc[:,price_cols].apply(lambda x,i=i: x/cum_dividers[i]) for i, df in enumerate(all_df2[:-1])] + [all_df2[-1].loc[:,price_cols]] 

#5.3: Forward addition adjustment
rel_delta = np.subtract(np.array(all_endprices[:-1]),np.array(all_startprices[1:])) #the price differences
cum_adddelta = np.cumsum(rel_delta) #the true delta that should be added to each dataframe
price_cols = ['open', 'high', 'low', 'close','avg','pre_close'] #adjust only the price columns
all_adj_df3 = [all_df2[0].loc[:,price_cols]] + [df.loc[:,price_cols].apply(lambda x,i=i: x + cum_adddelta[i]) for i, df in enumerate(all_df2[1:])]

#5.4: Backward addition adjustment
rel_delta = np.subtract(np.array(all_endprices[:-1]),np.array(all_startprices[1:])) #the price differences
cum_subdelta = np.cumsum(rel_delta[::-1])[::-1] #the true delta that should be subtracted from each dataframe
price_cols = ['open', 'high', 'low', 'close','avg','pre_close'] #adjust only the price columns
all_adj_df4 = [df.loc[:,price_cols].apply(lambda x,i=i: x - cum_subdelta[i]) for i, df in enumerate(all_df2[:-1])] + [all_df2[-1].loc[:,price_cols]] 

def check_equal(all_adj_df:list):
    for i in range(len(all_adj_df) - 1):
        print(all_adj_df[i].close.iloc[-1] - all_adj_df[i+1].open.iloc[0])

#Testing and Verification Below

check_equal(all_adj_df1)

check_equal(all_adj_df2)

check_equal(all_adj_df3)

check_equal(all_adj_df4)

final_df1 = pd.concat(all_adj_df1, axis = 0)
final_df1.close.plot()

#expected -- the forward multiplier method and backward multiplier method should produce price curves with 
#the same shape, but one is a constant multiple of another
final_df2 = pd.concat(all_adj_df2, axis = 0)
final_df2.close.plot()

print(final_df1.close/final_df2.close)

final_df3 = pd.concat(all_adj_df3, axis = 0)
final_df3.close.plot()

#expected
print(final_df3.close - final_df2.close)
print(final_df3.close/final_df2.close)

final_df4 = pd.concat(all_adj_df4, axis = 0)
final_df4.close.plot()

#expected
print(final_df4.close - final_df3.close)

#Useless code below, was used for simple experiments during the coding process

all_timeind.values[0][-1]

concat1 = pd.concat(all_df,join = 'outer') #read all files and concat them vertically
concat1.replace('', np.nan, inplace = True)
concat1.dropna(how = 'any', inplace = True)
print(concat1.shape)
concat1.head()

import math
math.prod(np.array([1,2,3]))

concat2 = concat1
concat2['Time'] = np.array(concat2.Time.values, dtype = np.datetime64) 
duplicate = concat2[concat2.duplicated(['Time'], keep = 'last')].index
print(concat2.dtypes)
print(concat2.shape)
concat2.head()

concat3 = concat2.drop(duplicate).set_index('Time')
# concat.to_csv(self.output_file_path, encoding = 'utf-8', sep = ',', header = True, index = True)

Roll_Dates_First_Of_Month(File_Reader)

#Roll_Dates_First_Of_Month Debug End

t1 = pd.Timestamp('2007-01-16')
t2 = pd.Timestamp('2007-01-21')

b[(b.index > t1) & (b.index < t2)]
