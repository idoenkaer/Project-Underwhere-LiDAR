import React, { useState } from 'react';
import { Stat, BiologicalAnalysis } from '../../types';
import { MetricCard } from '../common/MetricCard';

interface DataSheetProps {
    title: string;
    stats: Stat[];
}

interface BiologicalModuleProps {
    isLiveData: boolean;
    data: BiologicalAnalysis;
}

const DataSheetCard: React.FC<DataSheetProps> = ({ title, stats }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-cyan-300 mb-4">{title}</h3>
        <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
               <MetricCard key={index} {...stat} />
            ))}
        </div>
    </div>
);

const BiologicalModule: React.FC<BiologicalModuleProps> = ({ isLiveData, data }) => {
    const [analysisState, setAnalysisState] = useState<'idle' | 'processing' | 'complete'>('idle');

    const handleRunAnalysis = () => {
        setAnalysisState('processing');
        setTimeout(() => {
            setAnalysisState('complete');
        }, 3000); // Simulate 3-second analysis
    };

    if (analysisState === 'idle') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
                <div className="relative aspect-video w-full max-w-2xl rounded-lg bg-black border border-gray-700 overflow-hidden mb-6">
                    <img src="https://picsum.photos/seed/forest/1280/720" alt="Forest Scan" className="object-cover w-full h-full opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-400 text-lg">Raw Ecological Scan Data Loaded</p>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-200">Ready for Analysis</h2>
                <p className="mt-2 text-gray-400">The current Lidar scan contains potential biological data.</p>
                <button
                    onClick={handleRunAnalysis}
                    className="mt-6 px-6 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition flex items-center font-bold"
                >
                    Run Ecological Analysis
                </button>
            </div>
        );
    }

    if (analysisState === 'processing') {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
                <div className="relative aspect-video w-full max-w-2xl rounded-lg bg-black border border-gray-700 overflow-hidden mb-6">
                    <img src="https://picsum.photos/seed/forest/1280/720" alt="Forest Scan" className="object-cover w-full h-full opacity-20" />
                    {/* Animated scanning nodes */}
                    <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="absolute top-1/2 left-3/4 w-4 h-4 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                     <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                         <h2 className="text-2xl font-bold text-cyan-300 animate-pulse">Processing...</h2>
                     </div>
                </div>
                <p className="mt-2 text-gray-400">Applying AI segmentation algorithms to identify flora and fauna.</p>
            </div>
        );
    }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
            <div className="space-y-8">
                <div>
                    <h2 className="text-lg font-semibold text-gray-300 mb-4">Annotated Scan - Flora & Fauna ({isLiveData ? 'Live' : 'Simulated'})</h2>
                    <div className="relative aspect-video w-full rounded-lg bg-black border border-gray-700 overflow-hidden">
                        <img src="https://picsum.photos/seed/forest/1280/720" alt="Forest Scan" className="object-cover w-full h-full opacity-50" />
                        {/* Flora Annotation */}
                        <div className="absolute top-[20%] left-[25%] w-1/4 h-1/3 border-2 border-green-400 rounded-md bg-green-500/20 backdrop-blur-sm flex items-center justify-center">
                           <span className="text-green-300 font-bold text-sm bg-black/50 px-2 py-1 rounded">FLORA DETECTED</span>
                        </div>
                         {/* Fauna Annotation */}
                         <div className="absolute bottom-[15%] right-[10%] w-1/5 h-1/4 border-2 border-blue-400 rounded-md bg-blue-500/20 backdrop-blur-sm flex items-center justify-center">
                           <span className="text-blue-300 font-bold text-sm bg-black/50 px-2 py-1 rounded">FAUNA DETECTED</span>
                        </div>
                    </div>
                </div>
                 <div>
                    <h2 className="text-lg font-semibold text-gray-300 mb-4">Population Density Map</h2>
                    <div className="relative aspect-video w-full rounded-lg bg-black border border-gray-700 overflow-hidden">
                        <img src="https://picsum.photos/seed/forest/1280/720" alt="Forest Scan" className="object-cover w-full h-full opacity-20 blur-sm" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-500/40 to-red-600/50"></div>
                         <div className="absolute bottom-4 left-4 bg-black/50 p-3 rounded-lg text-sm">
                            <h3 className="font-bold text-white mb-2">Heatmap Legend</h3>
                            <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-red-600/80"></div><span>High Density</span></div>
                            <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-yellow-500/80"></div><span>Medium Density</span></div>
                             <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-blue-500/80"></div><span>Low Density</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-8">
                <DataSheetCard title="Canopy Analysis" stats={data.canopyStats} />
                <DataSheetCard title="Fauna Biometrics" stats={data.faunaStats} />
            </div>
        </div>
    );
};

export default BiologicalModule;