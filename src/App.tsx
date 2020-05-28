import React from "react";
import { finnhubKey, finnhubBase } from "./constants";


// left off at 285
const tickers: string[] = [
    "JPM", "BRK.A", "BAC", "AAPL", "T", "GOOGL", "MSFT", "XOM", "WFC", "C", "WMT", "VZ", "AMZN", "UNH",
    "CMCSA", "JNJ", "DIS", "INTC", "FB", "CVS", "GS", "MS", "PFE", "IBM", "GE", "CVX", "CI", "PG", "MET", 
    "CSCO", "RTX", "PP", "AXP", "GM", "MRK", "ORCL", "KO", "USB", "ANTM", "HD", "PRU", "ABBV", "DELL", 
    "CAT", "WBA", "BMY", "PNC", "V", "COST", "UPS", "DUK", "LMT", "CHTR", "HON", "AIG", "ABT", "BK",
    "COF", "AMGN", "TFC", "EXC", "LOW", "SO", "BLK", "NEE", "DE", "UNP", "TMO", "GILD", "PSX", "MDLZ", "AVGO",
    "MMM", "TGT", "MPC", "PGR", "COP", "PM", "MCD", "GD", "AFL", "TRV", "LLY", "KHC", "SCHW", "HCA", "DHR",
    "HUM", "NOC", "NIKE", "PYPL", "QCOM", "DAL", "KR", "MA", "D", "MU", "NFLX", "HPQ", "SBUX"
];

const fetchData = (ticker: string): any => {
    fetch(
      `${finnhubBase}stock/candle?symbol=${ticker}&resolution=D&from=1577750400&to=1590510123&token=${finnhubKey}`
    )
      .then((resp) => resp.json())
      .then(({c,h,l,o,t}) => {
          const stock = c.map((value: number, index: number) => {
            let close_price = value;
            let high_price = h[index];
            let low_price = l[index];
            let open_price = o[index];
            let date = convertToRealTime(t[index]);
            return { close_price, high_price, low_price, open_price, date }
          })
          const stockData = {
              "ticker": ticker,
              "dates": stock
          }
          inputStock(stockData);
       })

      .catch(error => {
          throw error;
      });
}

const inputStock = (stockData: Object) => {

    const query = `query {
        createStock (${stockData}) {
          ticker, dates  
        }
    }`
    fetch('http://localhost:4000/graphql', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Accept': `application/json` 
        },
        body: JSON.stringify({ query })
    })
    .then(resp => resp.json())
    .then(data => console.log(data))
}

const getStockData = (): any => {
    // tickers.forEach(ticker => {
    //     fetchData(ticker);
    // })
    fetchData("JPM");
};

const convertToRealTime = (unixTimestamp: number): string => {
    let milliseconds = unixTimestamp * 1000 // 1575909015000
    let dateObject = new Date(milliseconds)
    let humanDateFormat = dateObject.toLocaleString()
    return humanDateFormat
} 

const App: React.FC = () => {
return <div>{getStockData()}
<div>{convertToRealTime(10)}</div>
<p>{tickers.length}</p>
</div>;
};

export default App;
