import React from 'react';
import { TrendingUp } from 'lucide-react';

const MARKETS = [
    { id: 'R_10', name: 'Volatility 10 Index' },
    { id: 'R_25', name: 'Volatility 25 Index' },
    { id: 'R_50', name: 'Volatility 50 Index' },
    { id: 'R_75', name: 'Volatility 75 Index' },
    { id: 'R_100', name: 'Volatility 100 Index' },
    { id: '1HZ10V', name: 'Volatility 10 (1s) Index' },
    { id: '1HZ100V', name: 'Volatility 100 (1s) Index' },
];

export default function MarketSelector({ selected, onSelect }) {
    return (
        <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 max-w-md mx-auto my-6">
            <div className="flex items-center gap-2 mb-4 text-white">
                <TrendingUp size={20} className="text-deriv-accent" />
                <h2 className="text-lg font-bold">Select Market</h2>
            </div>
            <select
                value={selected}
                onChange={(e) => onSelect(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-deriv-accent outline-none"
            >
                {MARKETS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                ))}
            </select>
        </div>
    );
}
