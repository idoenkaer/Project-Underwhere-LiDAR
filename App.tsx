import React, { Suspense, lazy } from 'react';
import { Module } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { AppProvider, useAppContext } from './components/contexts/AppContext';

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

const AppContent: React.FC = () => {
  const { activeModule, setActiveModule, showOnboarding, handleCloseOnboarding } = useAppContext();

  const renderActiveModule = () => {
    switch (activeModule) {
      case Module.ROADMAP:
        return <RoadmapModule />;
      case Module.MEASUREMENT:
        return <MeasurementModule />;
      case Module.ENVIRONMENTAL:
        return <EnvironmentalModule />;
      case Module.TOPOGRAPHY:
        return <TopographyModule />;
      case Module.AI_DISCOVERY:
        return <AIDiscoveryModule />;
      case Module.BIOLOGICAL:
        return <BiologicalModule />;
      case Module.PHYSICS:
        return <PhysicsModule />;
      case Module.SPACETIME:
        return <SpaceTimeModule />;
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
        <Header />
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

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};


export default App;