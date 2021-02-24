import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import math
from scipy import stats
import pandas_datareader as web
from pyconstants import YEARLY_TRADING_DAYS, RISK_FREE_RATE

'''
[x] Annual return
[x] Cumulative return
[x] Volatility
[x] Annual volatility
[x] Sharpe ratio
[x] Calmar ratio
[] Stability #TODO: what is stability?
[x] Max drawdown
[x] Omega ratio
[x] Sortino ratio
[x] Skew
[x] Kurtosis
[x] Tail ratio
[] Common sense ratio #TODO
[x] Win percentage
[x] Win loss ratio
[x] Daily value at risk
[x] Gross leverage
[] Daily turnover #TODO
[x] Alpha
[x] Beta
'''

class Portfolio:
    def __init__(self, df, debt = None, equity = None, init_investment=1):
        self.returns = df['Percentage_Change']
        self.p_l = df['P_L']
        self.init_investment = init_investment
        self.debt = debt
        self.equity = equity
        self.num_trades = len(self.returns)
        self.wins = np.sum(self.returns > 0)
        self.losses = np.sum(self.returns <= 0)
        self.portfolio_values = init_investment * np.cumprod(1 + self.returns)

    def compute_cumulative_return(self):
        """
        #TODO: is this correct?
        Shouldn't this be a cumulative product?
        e.g cumulative_return = (1 + r1)(1 + r2) ... (1 + rn)
        """
        cumulative_return = self.p_l.sum() / self.init_investment
        return cumulative_return

    def compute_annual_return(self, cumulative_return):
        # TODO: move trading days to constants
        annual_return = cumulative_return  
        return annual_return

    def compute_win_percentage(self):
        win_percent = self.wins / self.num_trades
        return win_percent

    def compute_win_loss_ratio(self):
        if self.losses != 0:
            win_loss_ratio = self.wins / self.losses
            return win_loss_ratio
        return "None"
        

    def compute_volatility(self):
        n = self.num_trades
        volatility = np.std(self.returns) * math.sqrt(n - 1) / math.sqrt(n)
        return volatility

    def compute_annual_volatility(self, volatility):
        ann_volatility = math.sqrt(YEARLY_TRADING_DAYS) * volatility
        return ann_volatility

    def compute_sharpe_ratio(self, annual_return):
        excess_return = annual_return - RISK_FREE_RATE
        sigma = np.std(self.returns)
        sharpe_ratio = excess_return / sigma  # TODO: please check
        if math.isnan(sharpe_ratio):
            return "NaN"
        elif math.isinf(sharpe_ratio) and sharpe_ratio > 0:
            return "Infinity"
        elif math.isinf(sharpe_ratio) and sharpe_ratio < 0:
            return "-Infinity"
        return sharpe_ratio

    def compute_sortino_ratio(self, annual_return):
        excess_return = annual_return - RISK_FREE_RATE
        negative_returns = self.returns[self.returns < 0]
        sigma = np.std(negative_returns)
        sortino_ratio = excess_return / sigma  # TODO: please check
        if math.isnan(sortino_ratio):
            return "NaN"
        elif math.isinf(sortino_ratio) and sortino_ratio > 0:
            return "Infinity"
        elif math.isinf(sortino_ratio) and sortino_ratio < 0:
            return "-Infinity"
        return sortino_ratio

    def compute_max_drawdown(self):
        max_value = self.portfolio_values.max()
        min_value = self.portfolio_values.min()
        mdd = (min_value - max_value) / max_value
        return np.abs(mdd)

    def compute_calmar_ratio(self, annual_return, max_drawdown):
        calmar_ratio = annual_return / np.abs(max_drawdown)
        if math.isnan(calmar_ratio):
            return "NaN"
        elif math.isinf(calmar_ratio) and calmar_ratio > 0:
            return "Infinity"
        elif math.isinf(calmar_ratio) and calmar_ratio < 0:
            return "-Infinity"
        return calmar_ratio

    def compute_omega_ratio(self, required_return):
        excess_return = self.returns - RISK_FREE_RATE - required_return
        threshold_gains = np.sum(excess_return[np.where(excess_return > 0)[0]])
        threshold_loss = -np.sum(excess_return[np.where(excess_return < 0)[0]])
        if threshold_loss > 0:
            omega_ratio = threshold_gains / threshold_loss
            return omega_ratio
        else:
            return np.nan

    #def compute_beta(self, market_return):
    #    m = np.matrix([self.returns, market_return])
    #    return np.cov(m)[0][1] / np.std(market_return)

    def compute_skew(self):
        skew = stats.skew(self.returns, bias=False)
        return skew

    def compute_kurtosis(self):
        kurtosis = stats.kurtosis(self.returns, bias=False)
        return kurtosis

    def compute_tail_ratio(self, annual_return):
        tail_ratio = 0.95 * (annual_return / (0.05 * (annual_return)))
        return tail_ratio

    def compute_var(self, alpha=0.05):
        sorted_returns = np.sort(self.returns)
        index = int(alpha * len(sorted_returns))
        return abs(sorted_returns[index])

    #def compute_gross_leverage(self):
    #    gross_leverage = (self.equity + self.debt) / self.equity
    #    return gross_leverage

    #def compute_alpha(self, portfolio_return, beta, market_return):
    #    rf = RISK_FREE_RATE
    #    rm = market_return
    #    alpha = portfolio_return - rf - beta * (rm - rf)
    #    return alpha

    def summarize_performance(self, market_return, required_return):
        metrics = dict()
        metrics["Cumulative Return"] = self.compute_cumulative_return()
        metrics["Annual return"] = self.compute_annual_return(
            metrics["Cumulative Return"]
        )
        metrics["Win percentage"] = self.compute_win_percentage()
        metrics["Win loss ratio"] = self.compute_win_loss_ratio()
        metrics["Volatility"] = self.compute_volatility()
        metrics["Annual volatility"] = self.compute_annual_volatility(
            metrics["Volatility"]
        )
        metrics["Sharpe ratio"] = self.compute_sharpe_ratio(metrics["Annual return"])
        metrics["Sortino ratio"] = self.compute_sortino_ratio(metrics["Annual return"])
        metrics["Max drawdown"] = self.compute_max_drawdown()
        metrics["Calmar ratio"] = self.compute_calmar_ratio(
            metrics["Annual return"], metrics["Max drawdown"]
        )
        metrics["Omega ratio"] = self.compute_omega_ratio(required_return)
        #metrics["Beta"] = self.compute_beta(market_return)
        metrics["Skew"] = self.compute_skew()
        metrics["Kurtosis"] = self.compute_kurtosis()
        metrics["Tail ratio"] = self.compute_tail_ratio(metrics["Annual return"])
        metrics["VAR"] = self.compute_var()
        #metrics["Gross leverage"] = self.compute_gross_leverage()
        #metrics["Alpha"] = self.compute_alpha(
            #metrics["Cumulative return"], metrics["Beta"], market_return
        #)
        for key in metrics:
            if type(metrics[key]) is not str :
                metrics[key] = round(metrics[key], 4) 

        return metrics


# trade_record = pd.read_csv('D:\\Algo_Trading_Data\\trade_record.csv', sep = ',', encoding = 'utf-8')
# trade_record.drop(columns = trade_record.columns[0], inplace = True)
# trade_record['P_L'] = trade_record.Exit_Price.values - trade_record.Entry_Price.values
# trade_record.rename(columns = {'Percentage_Change': 'pct_change'}, inplace = True)
# trade_record.rename(columns = {'Long/Short': 'Long_Short'}, inplace = True)
# trade_record[['Entry_Date', 'Exit_Date']] = trade_record[['Entry_Date', 'Exit_Date']].apply(lambda date: pd.to_datetime(date))

# # calculating market return
# market = web.DataReader('SPY', data_source = 'yahoo', start = trade_record.Entry_Date.iloc[0], end = trade_record.Exit_Date.iloc[-1])
# market_return = (market.Close.iloc[-1] - market.Close.iloc[0])/market.Close.iloc[0]
# market_return = market_return.round(4)

# portfolio = Portfolio(trade_record['P_L'], init_investment = 100000)
# var = portfolio.compute_var(alpha = 0.6)
# portfolio.summarize_performance(market_return, 0.5)