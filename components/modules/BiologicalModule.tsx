import React, { useState } from 'react';
import { Stat } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { RecommendationsCard } from '../common/RecommendationsCard';
import { useDataContext } from '../contexts/DataContext';
import { useUIStateContext } from '../contexts/UIStateContext';
import { runBiologicalAnalysis } from '../../application/use-cases/runBiologicalAnalysis';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';
import { Card } from '../common/Card';
import { LeafIcon } from '../icons/LeafIcon';

interface DataSheetProps {
    title: string;
    stats: Stat[];
}

const DataSheetCard: React.FC<DataSheetProps> = ({ title, stats }) => (
    <Card title={title}>
        <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
               <MetricCard key={index} {...stat} />
            ))}
        </div>
    </Card>
);

const BiologicalModule: React.FC = () => {
    const { database } = useDataContext();
    const { isLiveData } = useUIStateContext();
    const data = database.biological;
    const [analysisState, setAnalysisState] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleRunAnalysis = async () => {
        setAnalysisState('processing');
        setError(null);
        try {
            const result = await runBiologicalAnalysis();
            setAnalysisState(result);
        } catch (e) {
            setError('The analysis failed to run due to an unexpected error. Please try again.');
            setAnalysisState('error');
        }
    };

    const handleReset = () => {
        setAnalysisState('idle');
        setError(null);
    };

    if (analysisState === 'error') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
                <div className="bg-error/10 border border-error text-error p-8 rounded-sm max-w-md">
                    <ExclamationTriangleIcon className="h-16 w-16 mx-auto text-error" />
                    <h2 className="text-2xl font-bold text-error mt-4">Analysis Failed</h2>
                    <p className="mt-2 text-text-primary">{error}</p>
                    <button onClick={handleReset} className="mt-6 px-4 py-2 bg-bg-secondary text-text-primary rounded-sm hover:bg-bg-secondary/50 transition font-semibold">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (analysisState === 'idle') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
                <div className="relative aspect-video w-full max-w-2xl rounded-sm bg-black border border-green-dark overflow-hidden mb-6">
                    <img src="https://picsum.photos/seed/forest/1280/720" alt="Forest Scan" className="object-cover w-full h-full opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-green-muted text-lg font-mono">Raw Ecological Scan Data Loaded</p>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-text-accent font-mono">Ready for Analysis</h2>
                <p className="mt-2 text-green-muted">The current Lidar scan contains potential biological data.</p>
                <button
                    onClick={handleRunAnalysis}
                    className="mt-6 px-6 py-3 bg-transparent border-2 border-green-bright text-green-bright font-mono rounded-sm uppercase tracking-wider hover:bg-green-bright hover:text-bg-primary transition-all duration-200 hover:shadow-glow-green-md flex items-center"
                >
                    <LeafIcon className="h-5 w-5 mr-2"/>
                    Run Ecological Analysis
                </button>
            </div>
        );
    }

    if (analysisState === 'processing') {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
                <div className="relative aspect-video w-full max-w-2xl rounded-sm bg-black border border-green-dark overflow-hidden mb-6">
                    <img src="https://picsum.photos/seed/forest/1280/720" alt="Forest Scan" className="object-cover w-full h-full opacity-20" />
                    <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-primary rounded-full animate-pulse"></div>
                    <div className="absolute top-1/2 left-3/4 w-4 h-4 bg-green-primary rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-green-primary rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                     <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                         <h2 className="text-2xl font-bold text-green-bright animate-pulse font-mono">Processing...</h2>
                     </div>
                </div>
                <p className="mt-2 text-green-muted">Applying AI segmentation algorithms to identify flora and fauna.</p>
            </div>
        );
    }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
            <div className="space-y-8">
                <div>
                    <h2 className="text-lg font-mono font-semibold text-text-primary mb-4">Annotated Scan - Flora & Fauna ({isLiveData ? 'Live' : 'Simulated'})</h2>
                    <div className="relative aspect-video w-full rounded-sm bg-black border border-green-dark overflow-hidden">
                        <img src="https://picsum.photos/seed/forest/1280/720" alt="Forest Scan" className="object-cover w-full h-full opacity-50" />
                        <div className="absolute top-[20%] left-[25%] w-1/4 h-1/3 border-2 border-green-primary rounded-sm bg-green-primary/20 backdrop-blur-sm flex items-center justify-center">
                           <span className="text-green-bright font-bold text-sm bg-black/50 px-2 py-1 rounded">FLORA DETECTED</span>
                        </div>
                         <div className="absolute bottom-[15%] right-[10%] w-1/5 h-1/4 border-2 border-data-blue rounded-sm bg-data-blue/20 backdrop-blur-sm flex items-center justify-center">
                           <span className="text-data-blue font-bold text-sm bg-black/50 px-2 py-1 rounded">FAUNA DETECTED</span>
                        </div>
                    </div>
                </div>
                 <div>
                    <h2 className="text-lg font-mono font-semibold text-text-primary mb-4">Population Density Map</h2>
                    <div className="relative aspect-video w-full rounded-sm bg-black border border-green-dark overflow-hidden">
                        <img src="https://picsum.photos/seed/forest/1280/720" alt="Forest Scan" className="object-cover w-full h-full opacity-20 blur-sm" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-warning/40 to-error/50"></div>
                         <div className="absolute bottom-4 left-4 bg-black/60 p-3 rounded-sm text-sm backdrop-blur-sm">
                            <h3 className="font-bold text-text-accent mb-2">Heatmap Legend</h3>
                            <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-error/80"></div><span>High Density</span></div>
                            <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-warning/80"></div><span>Medium Density</span></div>
                             <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-data-blue/80"></div><span>Low Density</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-8">
                <DataSheetCard title="Canopy Analysis" stats={data.canopyStats} />
                <DataSheetCard title="Fauna Biometrics" stats={data.faunaStats} />
                <RecommendationsCard recommendations={data.recommendations} />
            </div>
        </div>
    );
};

export default BiologicalModule;