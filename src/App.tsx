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

const getStockData = (): any => {
  fetch(
    `${finnhubBase}stock/candle?symbol=AAPL&resolution=D&from=1577750400&to=1590510123&token=${finnhubKey}`
  )
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
    });
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
