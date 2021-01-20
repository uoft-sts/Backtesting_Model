import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import math
from datetime import datetime
from copy import copy
from scipy.stats import skew, kurtosis

class Portfolio:
    #daily_ret is the relative return of each day
    def __init__(self, daily_ret: pd.Series):
        self.timerange = daily_ret.index #a list of times(DatetimeIndex obj)
        self.daily_rets = daily_ret.values #an array of daily return values
    def __str__(self):
        return "Time Range: {} to {}\n".format(self.timerange[0].strftime("%Y-%m-%d"), self.timerange[-1].strftime("%Y-%m-%d")) + \
               "Final Value: {:.4}\n".format(self.getCumRets()[-1]) + \
               "Annualized Return: {:.2%}\n".format(self.getAnnRet()) + \
                "Daily Volatility: {:.2%}\n".format(self.getVol()) + \
                "Annual Volatility: {:.2%}\n".format(self.getAnnVol()) + \
                "Sharpe Ratio: {:.4}\n".format(self.getSharpe()) + \
                "Value at Risk: {:.2%}\n".format(self.getVAR())
    #returns list of daily relative return, i.e. first element being 1.2 means 20% return on the first day
    def getRelRets(self):
        return self.daily_rets
    # returns a DatetimeIndex object, representing the time range
    def getTimeRange(self):
        return self.timerange
    # returns list of cumulative returns on each day
    def getCumRets(self):
        values = []
        cum_ret = 1
        for rel_ret in self.daily_rets:
            cum_ret *= rel_ret
            values.append(cum_ret)
        return values
    #returns the annualized return
    def getAnnRet(self):
        num_years = len(self.daily_rets)/252
        return self.getCumRets()[-1]**(1/num_years) - 1
    #note: volatility is a financial term meaning the standard deviation of stock returns
    #returns the SD(daily volatility)
    def getVol(self):
        #number of periods
        n = len(self.daily_rets)
        #numpy.sd calculates sample sd, so need to multiply by sqrt(n-1)/sqrt(n) to obtain actual sd
        return np.std(self.daily_rets)*math.sqrt(n-1)/math.sqrt(n)
    #returns the annualized volatility
    def getAnnVol(self):
        return math.sqrt(252)*self.getVol()
    #returns the Sharpe Ratio, default risk-free interest rate is 4%
    def getSharpe(self, risk_free = 0.04):
        excess_return = self.getAnnRet() - risk_free
        return excess_return/self.getAnnVol()
    #returns value at risk, default significance level is 5%
    def getVAR(self, sig_lv = 0.05):
        #round to integer
        n = int(sig_lv * len(self.getRelRets()))
        rel_rets = copy(self.getRelRets())
        rel_rets.sort()
        return abs(rel_rets[n] - 1)
    #returns tail ratio
    def getTail(self):
        return 0.95*(self.getAnnRet())/(0.05*(self.getAnnRet()))
    def beta(self, market):
        m = np.matrix([self.getAnnRet(), market])
        return np.cov(m)[0][1] / np.std(market)
    def alpha(self, bond_rate, inflation_rate, market):
        risk_free_rate = (1+ bond_rate) / (1+ inflation_rate) -1
        return self.getAnnRet() - risk_free_rate - self.beta(market)
    def skewness(self):
        return skew(self.daily_rets, bias=False)
    def kurtosis(self):
        return kurtosis(self.daily_rets, bias=False)
    def getMargin(self, num_shares, price, margin_rate):
        return num_shares * price * margin_rate