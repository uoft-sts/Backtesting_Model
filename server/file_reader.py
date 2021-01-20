# -*- coding: utf-8 -*-
"""main.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1fzaCruWB29olCW396FMyJCctgcAz5ib5
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import os

class File_Reader:
    def __init__(self, underlying, contract_exp, input_file_path = str,
                 output_file_path = str, 
                 underlying_filters = True, expiration_filters = True):
        # Store variables
        self.underlying = str.upper(underlying)
        self.contract_exp = contract_exp
        self.file_path = input_file_path
        self.output_file_path = output_file_path
        self.underlying_filters = underlying_filters
        self.expiration_filters = expiration_filters
        
        # Process file_path to associted files of each underlying product
        self.file_df = pd.DataFrame({'File_Name': os.listdir(input_file_path)}, dtype='object')
        self.file_df['Ticker'] = self.file_df.File_Name.apply(
            lambda file_name: file_name.split('.')[0])
        self.file_df['Exp_day'] = self.file_df.Ticker.str.extract('(\d+)')
        self.file_df['Underlying'] = self.file_df.Ticker.apply(lambda name: name[:-4])

        # Filter underlying product
    def underlying_filter(self):
        if self.underlying_filters:
            underlying_df = self.file_df[self.file_df.Underlying == self.underlying]
            return underlying_df
        else:
            pass
        
        # Filter contract expiration day
    def expiration_filter(self):
        if self.underlying_filters and self.expiration_filters:
            exp_df = self.underlying_filter()
            exp_df['Exp_Month'] = exp_df.Exp_day.apply(lambda exp: exp[-2:])
            exp_df = exp_df[exp_df.Exp_Month == self.contract_exp]
            return exp_df
        elif self.expiration_filters:
            exp_df = self.file_df
            exp_df['Exp_Month'] = exp_df.Exp_day.apply(lambda exp: exp[-2:])
            exp_df = exp_df[exp_df.Exp_Month == self.contract_exp]
            return exp_df

class Roll_Dates_First_Of_Month(File_Reader):
    def fit_transform(self, X):
        X.File_Name.sort_index()
        concat = pd.concat([pd.read_csv(self.file_path + '/' + f,
                                        encoding = 'utf-8', sep = ',') for f in X.File_Name],
                                        join = 'outer')
        concat.dropna(how = 'any', inplace = True)
        concat['Time'] = np.array(concat.Time.values, dtype = np.datetime64)
        
        duplicate = concat[concat.duplicated(['Time'], keep = 'last')].index
        concat = concat.drop(duplicate).set_index('Time')
        
        concat.to_csv(self.output_file_path, encoding = 'utf-8', sep = ',', header = True,
                      index = True)
        return concat

class Roll_Dates_Last_Trading_Day(File_Reader):
    def fit_transform(self, X):
        X.File_Name.sort_index()
        concat = pd.concat([pd.read_csv(self.file_path + '/' + f,
                                        encoding = 'utf-8', sep = ',') for f in X.File_Name],
                                        join = 'outer')
        concat.dropna(how = 'any', inplace = True)
        concat['Time'] = np.array(concat.Time.values, dtype = np.datetime64)
        
        duplicate = concat[concat.duplicated(['Time'], keep = 'first')].index
        concat = concat.drop(duplicate).set_index('Time')
        concat.to_csv(self.output_file_path, encoding = 'utf-8', sep = ',', header = True,
                      index = True)
        return concat

class Roll_Dates_Liquidity_Based(File_Reader):
    def fit_transform(self, X):
        pass
    




