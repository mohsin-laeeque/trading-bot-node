import express from "express";
const router = express.Router();
import axios from 'axios'


router.get('/', async (req, res, next) => {
    try {
        const { symbol, interval } = req.query
        const Res = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1000`);
        const resData = Res.data;

        let candleData = resData.map(d => ({
            time: d[0] / 1000,
            open: d[1] * 1,
            high: d[2] * 1,
            low: d[3] * 1,
            close: d[4] * 1,
        }))

        function calculateEMA(data, count) {
            var result = [];
            for (var i = 0; i < data.length; i++) {
                result.push(data[i].close);
            }
            const k = 2 / (count + 1);
            let emaData = [];
            emaData[0] = +result[0]

            for (let i = 1; i < result.length; i++) {
                let newPoint = (result[i] * k) + (emaData[i - 1] * (1 - k))
                emaData.push(newPoint)
            }
            let currentEma = [...emaData].map((elem, i) => {
                return { time: data[i].time, value: elem }
            })
            return currentEma

        }

        let emaData9 = calculateEMA(candleData, 9);
        let emaData26 = calculateEMA(candleData, 26);

        // const botStatusRes = await axios.get(`http://5166-182-191-113-19.ngrok.io/api/bot_trading_status/${symbol}/`)
        // const botStatusData = botStatusRes.data;

        const OHRes = await axios.get(`http://5166-182-191-113-19.ngrok.io/api/orders_history/${symbol}/`);
        const orderHistory = OHRes.data;

        const PLRes = await axios.get(`http://5166-182-191-113-19.ngrok.io/api/profit_loss_calculation/${symbol}`);
        const PLData = PLRes.data

        res.send({
            success: true, message: 'Graph Data fetched successfully',
            data: {
                symbol,
                interval,
                candleData,
                emaData9,
                emaData26,
                // botStatusData,
                orderHistory,
                PLData
            }
        })

    } catch (error) {
        return next(error)
    }
});

export default router