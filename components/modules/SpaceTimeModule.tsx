import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon } from '../icons/PlayerIcons';
import { SpaceTimeEvent } from '../../types';
import { useDataContext } from '../contexts/DataContext';
import { Card } from '../common/Card';

const EventAnnotation: React.FC<{ event: SpaceTimeEvent, isActive: boolean }> = ({ event, isActive }) => {
    const position = {
        growth: 'top-[20%] left-[25%]',
        erosion: 'top-[65%] left-[60%]',
        deformation: 'top-[30%] left-[40%]',
    }[event.type] || 'top-[50%] left-[50%]';

    const color = {
         growth: 'border-green-primary bg-green-primary/20 text-green-primary',
         erosion: 'border-warning bg-warning/20 text-warning',
         deformation: 'border-error bg-error/20 text-error',
         baseline: 'border-data-blue bg-data-blue/20 text-data-blue',
    }[event.type];

    if (!isActive || event.type === 'baseline') return null;

    return (
        <div className={`absolute ${position} w-1/4 h-1/4 border-2 rounded-sm flex items-center justify-center transition-opacity duration-500 ${isActive ? 'opacity-100 animate-fadeIn' : 'opacity-0'}`}>
            <div className={`absolute inset-0 ${color} backdrop-blur-sm opacity-50`}></div>
            <span className={`relative font-bold text-sm bg-black/50 px-2 py-1 rounded ${color}`}>
                {event.title}
            </span>
        </div>
    );
};


const SpaceTimeModule: React.FC = () => {
    const { database } = useDataContext();
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
                        setIsPlaying(false);
                        return 12;
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
                 <h2 className="text-lg font-mono font-semibold text-text-primary mb-4">4D Environmental Change Model</h2>
                 <div className="relative aspect-video w-full rounded-sm bg-black border border-green-dark overflow-hidden">
                    <img src="https://picsum.photos/seed/spacetime/1280/720" alt="4D Map" className="object-cover w-full h-full opacity-40" />
                    {events.map(event => (
                        <EventAnnotation key={event.month} event={event} isActive={currentMonth >= event.month} />
                    ))}
                 </div>
            </div>
            <div className="space-y-6">
                <Card title="Timeline Control">
                     <p className="text-sm text-text-primary mb-4">Simulating 12 months of sequential scan data.</p>
                     <div className="flex items-center space-x-4">
                        <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-bg-primary hover:bg-green-dark rounded-full">
                            {isPlaying ? <PauseIcon className="h-6 w-6 text-data-blue" /> : <PlayIcon className="h-6 w-6 text-data-blue" />}
                        </button>
                        <div className="flex-1">
                             <label htmlFor="timeline" className="block text-sm font-medium text-green-muted mb-1">Month: <span className="font-mono text-data-blue">{currentMonth}</span></label>
                             <input
                                id="timeline"
                                type="range"
                                min="0"
                                max="12"
                                value={currentMonth}
                                onChange={(e) => setCurrentMonth(parseInt(e.target.value, 10))}
                                className="w-full h-2 bg-green-dark rounded-lg appearance-none cursor-pointer"
                                style={{
                                    accentColor: 'var(--color-data-blue)'
                                }}
                            />
                        </div>
                     </div>
                </Card>
                 <Card title="Analysis Log">
                    <div ref={logContainerRef} className="h-64 bg-bg-primary/50 p-3 rounded-sm overflow-y-auto space-y-4">
                        {activeEvents.length > 0 ? (
                           [...activeEvents].reverse().map(event => (
                               <div key={event.month} className="animate-fadeIn">
                                <p className="font-bold text-data-blue font-mono">{event.title} (Month {event.month})</p>
                                <p className="text-sm text-text-primary">{event.description}</p>
                            </div>
                           ))
                        ) : (
                            <p className="text-green-muted">Move timeline to see events.</p>
                        )}
                    </div>
                 </Card>
            </div>
        </div>
    );
};

export default SpaceTimeModule;