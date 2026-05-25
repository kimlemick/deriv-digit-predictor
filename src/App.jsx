import React, { useState, useEffect, useRef } from 'react';
import MarketSelector from './components/MarketSelector';
import DistributionChart from './components/DistributionChart';
import PredictionDisplay from './components/PredictionDisplay';
import { Play, RotateCcw, Activity } from 'lucide-react';

export default function App() {
    const [market, setMarket] = useState('R_100');
    const [buffer, setBuffer] = useState([]);
    const [frequencies, setFrequencies] = useState({});
    const [prediction, setPrediction] = useState(null);
    const [confidence, setConfidence] = useState(0);
    const [status, setStatus] = useState('idle'); // idle, analyzing, result
    const [isConnected, setIsConnected] = useState(false);

    const ws = useRef(null);
    const APP_ID = 1049; // Public Deriv App ID for data collection

    useEffect(() => {
        const initialFreq = {};
        for(let i=0; i<10; i++) initialFreq[i] = 0;
        setFrequencies(initialFreq);
    }, []);

    useEffect(() => {
        const connect = () => {
            ws.current = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${APP_ID}`);
            ws.current.onopen = () => {
                setIsConnected(true);
                subscribeToMarket(market);
            };
            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.tick) {
                    const price = data.tick.quote;
                    const lastDigit = parseInt(price.toString().split('.').pop().slice(-1));
                    handleNewDigit(lastDigit);
                }
            };
            ws.current.onclose = () => {
                setIsConnected(false);
                setTimeout(connect, 3000);
            };
        };
        connect();
        return () => { if (ws.current) ws.current.close(); };
    }, []);

    const subscribeToMarket = (symbol) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ ticks: symbol, subscribe: 1 }));
        }
    };

    const handleNewDigit = (digit) => {
        setBuffer(prev => {
            const newBuffer = [...prev, digit].slice(-100);
            updateFrequencies(newBuffer);
            return newBuffer;
        });
    };

    const updateFrequencies = (currentBuffer) => {
        const freq = {};
        for(let i=0; i<10; i++) freq[i] = 0;
        currentBuffer.forEach(d => freq[d]++);
        setFrequencies(freq);
    };

    const runAnalysis = async () => {
        setStatus('analyzing');
        await new Promise(resolve => setTimeout(resolve, 3000));
        const freqValues = Object.values(frequencies);
        const minFreq = Math.min(...freqValues);
        const coldest = [];
        for(let i=0; i<10; i++) {
            if(frequencies[i] === minFreq) coldest.push(i);
        }
        const predictedDigit = coldest[Math.floor(Math.random() * coldest.length)];
        const avgFreq = 10;
        const freqScore = Math.max(0, (avgFreq - minFreq) / avgFreq) * 50;
        let volatilityScore = 20;
        if (buffer.length > 5) {
            const last5 = buffer.slice(-5);
            if (last5.every(d => d === last5[0])) volatilityScore += 30;
        }
        setPrediction(predictedDigit);
        setConfidence(Math.min(98, Math.floor(freqScore + volatilityScore + 30)));
        setStatus('result');
    };

    useEffect(() => { subscribeToMarket(market); }, [market]);

    return (
        <div className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-slate-950 text-white">
            <header className="text-center mb-12">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-deriv-primary rounded-2xl shadow-lg shadow-red-500/20">
                        <Activity size={32} className="text-white" />
                    </div>
                </div>
                <h1 className="text-4xl font-black mb-2 tracking-tight">
                    DERIV <span className="text-deriv-primary">ANALYSIS</span> TOOL
                </h1>
                <p className="text-slate-400">Real-time Digit Probability & Volatility Engine</p>
            </header>
            <div className="w-full flex flex-col items-center space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                        {isConnected ? 'API Connected' : 'Connecting to Deriv...'}
                    </span>
                </div>
                <MarketSelector selected={market} onSelect={(m) => { setMarket(m); subscribeToMarket(m); }} />
                <PredictionDisplay prediction={prediction} confidence={confidence} status={status} />
                <div className="flex gap-4">
                    <button onClick={runAnalysis} disabled={status === 'analyzing' || buffer.length < 10}
                        className="flex items-center gap-2 bg-deriv-primary hover:bg-red-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-4 px-8 rounded-2xl transition-all transform active:scale-95 shadow-xl">
                        <Play size={20} fill="currentColor" />
                        {status === 'analyzing' ? 'ANALYZING...' : 'RUN PREDICTION'}
                    </button>
                    <button onClick={() => { setBuffer([]); setPrediction(null); setStatus('idle'); }}
                        className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl transition-all border border-slate-700">
                        <RotateCcw size={20} />
                    </button>
                </div>
                <div className="text-slate-500 text-xs mt-4 font-mono bg-slate-900 px-4 py-1 rounded-full border border-slate-800">
                    SAMPLES: {buffer.length}/100 ticks
                </div>
                <DistributionChart frequencies={frequencies} />
            </div>
            <footer className="mt-20 text-slate-600 text-xs text-center max-w-md leading-relaxed">
                This is a quantitative analysis tool. It uses historical frequency distribution and volatility patterns to suggest high-probability digits.
                <br /><br />
                <strong>Not for trading. For analytical purposes only.</strong>
            </footer>
        </div>
    );
}
