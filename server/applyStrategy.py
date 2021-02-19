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
import numpy as np
import pandas_datareader as web

class Strategies:
    