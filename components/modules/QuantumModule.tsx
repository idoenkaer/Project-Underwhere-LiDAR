import React, { useState, useEffect, useRef } from 'react';

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
                <h2 className="text-lg font-semibold text-gray-300 mb-4">Advanced Physics Simulation</h2>
                <div className="relative aspect-video w-full rounded-lg bg-black border border-gray-700 overflow-hidden">
                    <div className="absolute inset-0 bg-[image:var(--img-quantum-bg)] bg-cover opacity-30"></div>
                     <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black"></div>
                    {isRunning && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                           <div className="text-center">
                             <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400 mx-auto"></div>
                             <p className="text-purple-300 text-lg mt-4">Calculating Spacetime Curvature...</p>
                           </div>
                        </div>
                    )}
                    {!isRunning && log.length > 1 && (
                        <div className="absolute inset-0 flex items-center justify-center animate-fadeIn">
                             <div className="w-1/2 h-1/2 rounded-full border-4 border-cyan-400/50 flex items-center justify-center">
                                 <div className="w-8 h-8 rounded-full bg-cyan-200 shadow-[0_0_20px_10px_rgba(100,200,255,0.5)]"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">Simulation Parameters</h3>
                    <div className="space-y-4 bg-gray-800/50 p-4 rounded-lg">
                       <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Simulation Type</label>
                            <select value={simulation} onChange={(e) => setSimulation(e.target.value as SimulationType)} className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500">
                                <option value="lensing">Gravitational Lensing</option>
                                <option value="tunneling" disabled>Quantum Tunneling (Not Implemented)</option>
                            </select>
                       </div>
                        <div>
                            <label htmlFor="scannedMass" className="block text-sm font-medium text-gray-400 mb-2">Scanned Mass: <span className="font-mono text-purple-300">{scannedMass.toExponential(2)} kg</span></label>
                             <input id="scannedMass" type="range" min="1e10" max="1e14" step="1e10" value={scannedMass} onChange={e => setScannedMass(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" disabled={isRunning} />
                        </div>
                         <div>
                            <label htmlFor="lightSourceDistance" className="block text-sm font-medium text-gray-400 mb-2">Source Distance: <span className="font-mono text-purple-300">{lightSourceDistance.toExponential(2)} km</span></label>
                             <input id="lightSourceDistance" type="range" min="1e6" max="1e7" step="1e5" value={lightSourceDistance} onChange={e => setLightSourceDistance(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" disabled={isRunning} />
                        </div>
                    </div>
                     <button onClick={runSimulation} disabled={isRunning} className="mt-4 w-full p-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:bg-gray-600 disabled:cursor-wait transition">
                        {isRunning ? 'Simulating...' : 'Run Simulation'}
                    </button>
                </div>
                 <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">Calculation Log</h3>
                    <div ref={logContainerRef} className="bg-black/50 p-3 rounded-lg flex-1 h-48 overflow-y-auto font-mono text-xs text-green-400 space-y-1">
                        {log.map((line, i) => <p key={i}>{line}</p>)}
                         {isRunning && <div className="w-2 h-4 bg-green-400 animate-pulse"></div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuantumModule;