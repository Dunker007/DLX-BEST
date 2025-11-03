import { useState, useEffect } from 'react';

export const useCryptoTicker = (initialData: {[key: string]: {price: number, change: number}}) => {
    const [cryptoData, setCryptoData] = useState(initialData);
    useEffect(() => {
        const interval = setInterval(() => {
            setCryptoData(prevData => {
                const newData = { ...prevData };
                for (const coin in newData) {
                    const changePercent = (Math.random() - 0.5) * 0.5;
                    const newPrice = newData[coin].price * (1 + changePercent / 100);
                    newData[coin] = { price: newPrice, change: changePercent };
                }
                return newData;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    return cryptoData;
};
