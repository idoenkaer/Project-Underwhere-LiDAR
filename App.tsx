import React, { useState, Suspense, lazy, useEffect } from 'react';
import { Module, ScanMetadata } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { db } from './services/mockDb';

// Lazy load all modules
const RoadmapModule = lazy(() => import('./components/modules/RoadmapModule'));
const MeasurementModule = lazy(() => import('./components/modules/MeasurementModule'));
const EnvironmentalModule = lazy(() => import('./components/modules/EnvironmentalModule'));
const TopographyModule = lazy(() => import('./components/modules/TopographyModule'));
const AIDiscoveryModule = lazy(() => import('./components/modules/AIDiscoveryModule'));
const BiologicalModule = lazy(() => import('./components/modules/BiologicalModule'));
const PhysicsModule = lazy(() => import('./components/modules/PhysicsModule'));
const SpaceTimeModule = lazy(() => import('./components/modules/SpaceTimeModule'));
const ResearchModule = lazy(() => import('./components/modules/ResearchModule'));
const QuantumModule = lazy(() => import('./components/modules/QuantumModule'));
const OnboardingModule = lazy(() => import('./components/common/OnboardingModule'));


const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
    </div>
);

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<Module>(Module.ROADMAP);
  const [isLiveData, setIsLiveData] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [scanMeta] = useState<ScanMetadata>(db.scanMeta);

  useEffect(() => {
    // Show onboarding only once per session
    if (!sessionStorage.getItem('onboardingComplete')) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    sessionStorage.setItem('onboardingComplete', 'true');
    setShowOnboarding(false);
    setActiveModule(Module.MEASUREMENT); // Guide user to the first demo module
  };


  const renderActiveModule = () => {
    switch (activeModule) {
      case Module.ROADMAP:
        return <RoadmapModule />;
      case Module.MEASUREMENT:
        return <MeasurementModule />;
      case Module.ENVIRONMENTAL:
        return <EnvironmentalModule data={db.environmental} />;
      case Module.TOPOGRAPHY:
        return <TopographyModule isLiveData={isLiveData} />;
      case Module.AI_DISCOVERY:
        return <AIDiscoveryModule />;
      case Module.BIOLOGICAL:
        return <BiologicalModule isLiveData={isLiveData} data={db.biological} />;
      case Module.PHYSICS:
        return <PhysicsModule />;
      case Module.SPACETIME:
        return <SpaceTimeModule events={db.spacetime.events} />;
       case Module.RESEARCH:
        return <ResearchModule />;
      case Module.QUANTUM:
        return <QuantumModule />;
      default:
        return <RoadmapModule />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 font-sans">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={activeModule} isLiveData={isLiveData} setIsLiveData={setIsLiveData} scanMeta={scanMeta} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 blueprint-bg">
           <Suspense fallback={<LoadingSpinner />}>
            {showOnboarding && <OnboardingModule onClose={handleCloseOnboarding} />}
            {renderActiveModule()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default App;