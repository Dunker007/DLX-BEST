import React from 'react';
import { useCryptoTicker } from '../../hooks/useCryptoTicker';
import { initialCryptoData } from '../../data/initialData';

export const CryptoLab = React.memo(() => {
    const cryptoData = useCryptoTicker(initialCryptoData);
    return (<div className="lab-container crypto-lab"><h1 className="lab-header">Crypto Lab</h1><div className="crypto-ticker">{Object.keys(cryptoData).map((coin) => {
        const data = cryptoData[coin];
        return (
            <div key={coin} className="crypto-card">
                <h3>{coin}</h3>
                {/* FIX: Replaced Object.entries with Object.keys to ensure proper type inference for the 'data' object. */}
                <p className="crypto-price">${data.price.toFixed(2)}</p>
                <p className={`crypto-change ${data.change >= 0 ? 'positive' : 'negative'}`}>
                    {data.change >= 0 ? '▲' : '▼'} {Math.abs(data.change).toFixed(2)}%
                </p>
            </div>
        );
    })}</div></div>);
});
