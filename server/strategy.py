import talib

df = df_.copy()

df['EMA50'] = talib.EMA(df.close, timeperiod = 50)
df['EMA200'] = talib.EMA(df.close, timeperiod = 200)
df.dropna(how = 'any', inplace = True)

df['Buy_signal'] = np.where(df.EMA50 > df.EMA200, 1, 0)
df

plt.figure(figsize = (20, 10))
plt.plot(df['close'], label = 'Close Price')
plt.plot(df['EMA50'], label = 'EMA50')
plt.plot(df['EMA200'], label = 'EMA200')
plt.legend(loc = 'best')

plt.show()
