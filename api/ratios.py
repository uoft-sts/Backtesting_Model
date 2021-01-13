"""
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
"""
import math
import numpy as np
from api import constants
from scipy import stats


class Portfolio:
    def __init__(self, portfolio_returns, debt, equity, init_investment=1):
        self.returns = portfolioreturns
        self.debt = debt
        self.equity = equity
        self.num_trades = len(returns)
        self.wins = np.sum(returns > 0)
        self.losses = np.sum(returns <= 0)
        self.portfolio_values = init_investment * np.cumprod(1 + returns)

    def summarize_performance(self, market_return, required_return):
        metrics = dict()
        metrics["Cumulative return"] = self.compute_cumulative_return()
        metrics["Annual return"] = self.compute_annual_return(
            metrics["Cumulative_Return"]
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
        metrics["Beta"] = self.compute_beta()
        metrics["Skew"] = self.compute_skew()
        metrics["Kurtosis"] = self.compute_kurtosis()
        metrics["Tail ratio"] = self.compute_tail_ratio(metrics["Annual return"])
        metrics["VAR"] = self.compute_var()
        metrics["Gross leverage"] = self.compute_gross_leverage()
        metrics["Alpha"] = self.compute_alpha(
            metrics["Cumulative return"], metrics["Beta"], market_return
        )

        return metrics

    def compute_cumulative_return(self):
        """
        #TODO: is this correct?
        Shouldn't this be a cumulative product?
        e.g cumulative_return = (1 + r1)(1 + r2) ... (1 + rn)
        """
        for r in self.returns:
            cumulative_return += r
        return cumulative_return

    def compute_annual_return(self, cumulative_return):
        # TODO: move trading days to constants
        annual_return = (cumulative_return / 365) * 240
        return annual_return

    def compute_win_percentage(self):
        win_percent = self.wins / self.num_trades
        return win_percent

    def compute_win_loss_ratio(self):
        win_loss_ratio = self.wins / self.losses
        return win_loss_ratio

    def compute_volatility(self):
        n = self.num_trades
        volatility = np.std(self.returns) * math.sqrt(n - 1) / math.sqrt(n)
        return volatility

    def compute_annual_volatility(self, volatility):
        ann_volatility = math.sqrt(constants.YEARLY_TRADING_DAYS) * volatility
        return ann_volatility

    def compute_sharpe_ratio(self, annual_return):
        excess_return = annual_return - constants.RISK_FREE_RATE
        sigma = np.std(self.returns)
        sharpe_ratio = excess_return / sigma  # TODO: please check
        return sharpe_ratio

    def compute_sortino_ratio(self, annual_return):
        excess_return = annual_return - constants.RISK_FREE_RATE
        negative_returns = self.returns(np.where(self.returns < 0))
        sigma = np.std(negative_returns)
        sortino_ratio = excess_return / sigma  # TODO: please check
        return sortino_ratio

    def compute_max_drawdown(self):
        max_value = self.portfolio_values.max()
        min_value = self.portfolio_values.min()
        mdd = (min_value - max_value) / max_value
        return np.abs(mdd)

    def compute_calmar_ratio(self, annual_return, max_drawdown):
        calmar_ratio = annual_return / np.abs(max_drawdown)
        return calmar_ratio

    def compute_omega_ratio(self, required_return):
        excess_return = self.returns - constants.RISK_FREE_RATE - required_return
        threshold_gains = np.sum(excess_return[np.where(excess_return > 0)])
        threshold_loss = -np.sum(excess_return[np.where(excess_return < 0)])
        if threshold_loss > 0:
            omega_ratio = threshold_gains / threshold_loss
            return omega_ratio
        else:
            return np.nan

    def compute_beta(self):
        m = np.matrix([self.returns, self.market_returns])
        return np.cov(m)[0][1] / np.std(market)

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

    def compute_gross_leverage(self):
        gross_leverage = (self.equity + self.debt) / self.equity
        return gross_leverage

    def compute_alpha(self, portfolio_return, beta, market_return):
        rf = constants.RISK_FREE_RATE
        rm = market_return
        alpha = portfolio_return - rf - beta * (rm - rf)
        return alpha
