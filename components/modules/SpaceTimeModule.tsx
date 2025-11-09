import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon } from '../icons/PlayerIcons';
import { SpaceTimeEvent } from '../../types';
import { useAppContext } from '../contexts/AppContext';

const EventAnnotation: React.FC<{ event: SpaceTimeEvent, isActive: boolean }> = ({ event, isActive }) => {
    const position = {
        growth: 'top-[20%] left-[25%]',
        erosion: 'top-[65%] left-[60%]',
        deformation: 'top-[30%] left-[40%]',
    }[event.type] || 'top-[50%] left-[50%]';

    const color = {
         growth: 'border-green-400 bg-green-500/20 text-green-300',
         erosion: 'border-yellow-400 bg-yellow-500/20 text-yellow-300',
         deformation: 'border-red-400 bg-red-500/20 text-red-300',
         baseline: 'border-cyan-400 bg-cyan-500/20 text-cyan-300',
    }[event.type];

    if (!isActive || event.type === 'baseline') return null;

    return (
        <div className={`absolute ${position} w-1/4 h-1/4 border-2 rounded-md flex items-center justify-center transition-opacity duration-500 ${isActive ? 'opacity-100 animate-fadeIn' : 'opacity-0'}`}>
            <div className={`absolute inset-0 ${color} backdrop-blur-sm opacity-50`}></div>
            <span className={`relative font-bold text-sm bg-black/50 px-2 py-1 rounded ${color}`}>
                {event.title}
            </span>
        </div>
    );
};


const SpaceTimeModule: React.FC = () => {
    const { database } = useAppContext();
    const events = database.spacetime.events;
    const [currentMonth, setCurrentMonth] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let timerId: number | undefined;
        if (isPlaying) {
            timerId = window.setInterval(() => {
                setCurrentMonth(prev => {
                    if (prev >= 12) {
                        setIsPlaying(false); // Stop playing
                        return 12; // Stay at the end
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => {
            if (timerId) {
                clearInterval(timerId);
            }
        };
    }, [isPlaying]);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [currentMonth]);

    const activeEvents = events.filter(e => currentMonth >= e.month);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            <div className="lg:col-span-2">
                 <h2 className="text-lg font-semibold text-gray-300 mb-4">4D Environmental Change Model</h2>
                 <div className="relative aspect-video w-full rounded-lg bg-black border border-gray-700 overflow-hidden">
                    <img src="https://picsum.photos/seed/spacetime/1280/720" alt="4D Map" className="object-cover w-full h-full opacity-40" />
                    {events.map(event => (
                        <EventAnnotation key={event.month} event={event} isActive={currentMonth >= event.month} />
                    ))}
                 </div>
            </div>
            <div className="space-y-6 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div>
                     <h3 className="text-lg font-semibold text-gray-300 mb-2">Timeline Control</h3>
                     <p className="text-sm text-gray-400 mb-4">Simulating 12 months of sequential scan data.</p>
                     <div className="flex items-center space-x-4">
                        <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full">
                            {isPlaying ? <PauseIcon className="h-6 w-6 text-cyan-300" /> : <PlayIcon className="h-6 w-6 text-cyan-300" />}
                        </button>
                        <div className="flex-1">
                             <label htmlFor="timeline" className="block text-sm font-medium text-gray-400 mb-1">Month: <span className="font-mono text-cyan-300">{currentMonth}</span></label>
                             <input
                                id="timeline"
                                type="range"
                                min="0"
                                max="12"
                                value={currentMonth}
                                onChange={(e) => setCurrentMonth(parseInt(e.target.value, 10))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                     </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Analysis Log</h3>
                    <div ref={logContainerRef} className="h-64 bg-black/50 p-3 rounded-lg overflow-y-auto space-y-4">
                        {activeEvents.length > 0 ? (
                           activeEvents.map(event => (
                               <div key={event.month} className="animate-fadeIn">
                                <p className="font-bold text-cyan-300">{event.title} (Month {event.month})</p>
                                <p className="text-sm text-gray-300">{event.description}</p>
                            </div>
                           ))
                        ) : (
                            <p className="text-gray-400">Move timeline to see events.</p>
                        )}
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default SpaceTimeModule;