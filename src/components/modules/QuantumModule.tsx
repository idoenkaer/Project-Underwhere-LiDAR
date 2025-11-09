import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../common/Card';
import { ChipIcon } from '../icons/ChipIcon';

type SimulationType = 'lensing' | 'tunneling';

const QuantumModule: React.FC = () => {
    const [simulation, setSimulation] = useState<SimulationType>('lensing');
    const [isRunning, setIsRunning] = useState(false);
    const [log, setLog] = useState<string[]>([]);
    const logContainerRef = useRef<HTMLDivElement>(null);
    
    // Simulation Parameters
    const [scannedMass, setScannedMass] = useState(1.5e12); // in kg
    const [lightSourceDistance, setLightSourceDistance] = useState(5e6); // in km

    useEffect(() => {
      let intervalId: number | undefined;
      if (isRunning) {
        setLog(['[0.00s] Initializing quantum simulation core...']);
        let time = 0;
        intervalId = window.setInterval(() => {
          time += 0.25;
          if (time >= 2.75) {
              setLog(prev => [...prev, `[${time.toFixed(2)}s] Simulation converged. Visualizing Einstein ring.`]);
              setIsRunning(false); // This will trigger cleanup and stop the interval
          } else {
             setLog(prev => [...prev, `[${time.toFixed(2)}s] Calculating tensor fields... Iteration ${Math.floor(Math.random() * 1e6)}`]);
          }
        }, 250);
      }
      return () => {
        if (intervalId) {
            clearInterval(intervalId);
        }
      };
    }, [isRunning]);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [log]);

    const runSimulation = () => {
        setIsRunning(true);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            <div className="lg:col-span-2">
                <h2 className="text-lg font-mono font-semibold text-text-primary mb-4">Quantum Simulation Visualizer</h2>
                <div className="relative aspect-video w-full rounded-sm bg-black border border-green-dark overflow-hidden">
                    <div className="absolute inset-0 bg-[image:var(--img-quantum-bg)] bg-cover opacity-10"></div>
                     <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black"></div>
                    {isRunning && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                           <div className="text-center">
                             <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-data-blue mx-auto"></div>
                             <p className="text-data-blue text-lg mt-4 font-mono">Calculating Spacetime Curvature...</p>
                           </div>
                        </div>
                    )}
                    {!isRunning && log.length > 1 && (
                        <div className="absolute inset-0 flex items-center justify-center animate-fadeIn">
                             <div className="w-1/2 h-1/2 rounded-full border-4 border-data-blue/50 flex items-center justify-center">
                                 <div className="w-8 h-8 rounded-full bg-data-blue shadow-[0_0_20px_10px_rgba(0,204,255,0.3)]"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-6">
                <Card title="Simulation Parameters" icon={ChipIcon}>
                    <div className="space-y-4">
                       <div>
                            <label className="block text-sm font-medium text-green-muted mb-2">Simulation Type</label>
                            <select value={simulation} onChange={(e) => setSimulation(e.target.value as SimulationType)} className="w-full bg-bg-primary border border-green-dark rounded-sm px-3 py-2 focus:ring-data-blue focus:border-data-blue font-mono">
                                <option value="lensing">Gravitational Lensing</option>
                                <option value="tunneling" disabled>Quantum Tunneling (Not Implemented)</option>
                            </select>
                       </div>
                        <div>
                            <label htmlFor="scannedMass" className="block text-sm font-medium text-green-muted mb-2">Scanned Mass: <span className="font-mono text-data-blue">{scannedMass.toExponential(2)} kg</span></label>
                             <input id="scannedMass" type="range" min="1e10" max="1e14" step="1e10" value={scannedMass} onChange={e => setScannedMass(parseFloat(e.target.value))} className="w-full h-2 bg-green-dark rounded-lg appearance-none cursor-pointer accent-data-blue" disabled={isRunning} />
                        </div>
                         <div>
                            <label htmlFor="lightSourceDistance" className="block text-sm font-medium text-green-muted mb-2">Source Distance: <span className="font-mono text-data-blue">{lightSourceDistance.toExponential(2)} km</span></label>
                             <input id="lightSourceDistance" type="range" min="1e6" max="1e7" step="1e5" value={lightSourceDistance} onChange={e => setLightSourceDistance(parseFloat(e.target.value))} className="w-full h-2 bg-green-dark rounded-lg appearance-none cursor-pointer accent-data-blue" disabled={isRunning} />
                        </div>
                    </div>
                     <button onClick={runSimulation} disabled={isRunning} className="mt-4 w-full p-4 bg-data-blue/80 hover:bg-data-blue text-white font-bold rounded-sm disabled:opacity-50 disabled:bg-green-dark disabled:cursor-wait transition">
                        {isRunning ? 'Simulating...' : 'Run Simulation'}
                    </button>
                </Card>
                 <Card title="Calculation Log">
                    <div ref={logContainerRef} className="bg-bg-primary/50 p-3 rounded-sm flex-1 h-48 overflow-y-auto font-mono text-xs text-green-primary space-y-1">
                        {log.map((line, i) => <p key={i}>{line}</p>)}
                         {isRunning && <div className="w-2 h-4 bg-green-primary animate-pulse"></div>}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default QuantumModule;