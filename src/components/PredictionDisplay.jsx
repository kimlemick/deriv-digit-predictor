import React from 'react';
import { Target } from 'lucide-react';

export default function PredictionDisplay({ prediction, confidence, status }) {
    if (status === 'idle') {
        return (
            <div className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 text-center max-w-md mx-auto my-6">
                <div className="flex justify-center mb-4">
                    <Target size={48} className="text-slate-600 animate-pulse" />
                </div>
                <p className="text-slate-400">Ready to analyze market patterns...</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 text-center max-w-md mx-auto my-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-deriv-primary"></div>
            <div className="flex justify-center mb-4">
                {status === 'analyzing' ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deriv-accent"></div>
                ) : (
                    <Target size={48} className="text-deriv-primary" />
                )}
            </div>

            {status === 'result' && (
                <>
                    <h3 className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-2">Predicted Digit</h3>
                    <div className="text-6xl font-black text-white mb-6 font-mono">{prediction}</div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="flex justify-between w-full text-xs text-slate-500 mb-1 px-2">
                            <span>Confidence</span>
                            <span>{confidence}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700">
                            <div
                                className="h-full bg-deriv-accent transition-all duration-1000 ease-out"
                                style={{ width: `${confidence}%` }}
                            ></div>
                        </div>
                    </div>
                </>
            )}

            {status === 'analyzing' && (
                <div className="text-white font-bold animate-pulse">Analyzing Distribution...</div>
            )}
        </div>
    );
}
