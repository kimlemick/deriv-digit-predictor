import React from 'react';

export default function DistributionChart({ frequencies }) {
    const maxFreq = Math.max(...Object.values(frequencies), 1);

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 w-full max-w-2xl mx-auto my-6">
            <h3 className="text-center text-slate-400 text-sm mb-6 uppercase tracking-wider font-semibold">Digit Distribution</h3>
            <div className="flex items-end justify-between gap-2 h-48">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => {
                    const freq = frequencies[digit] || 0;
                    const height = (freq / maxFreq) * 100;
                    return (
                        <div key={digit} className="flex flex-col items-center w-full group">
                            <div
                                className="w-full bg-deriv-accent rounded-t-sm transition-all duration-500 ease-out group-hover:bg-white"
                                style={{ height: `${height}%`, minHeight: '4px' }}
                            ></div>
                            <span className="text-xs text-slate-500 mt-2 font-mono">{digit}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
