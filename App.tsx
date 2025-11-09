import React, { Suspense, lazy } from 'react';
import { Module } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { UIStateProvider, useUIStateContext } from './components/contexts/UIStateContext';
import { DataProvider } from './components/contexts/DataContext';

// Lazy load all modules
const RoadmapModule = lazy(() => import('./components/modules/RoadmapModule'));
const MeasurementModule = lazy(() => import('./components/modules/MeasurementModule'));
const TopographyModule = lazy(() => import('./components/modules/TopographyModule'));
const ResearchModule = lazy(() => import('./components/modules/ResearchModule'));
const ValidationModule = lazy(() => import('./components/modules/ValidationModule'));
const OnboardingModule = lazy(() => import('./components/common/OnboardingModule'));
const EthicsSplashScreen = lazy(() => import('./components/common/EthicsSplashScreen'));


const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-bright"></div>
    </div>
);

const AppContent: React.FC = () => {
  const { activeModule, showOnboarding, handleCloseOnboarding, showEthicsSplash, handleCloseEthicsSplash } = useUIStateContext();

  const renderActiveModule = () => {
    switch (activeModule) {
      case Module.ROADMAP:
        return <RoadmapModule />;
      case Module.MEASUREMENT:
        return <MeasurementModule />;
      case Module.TOPOGRAPHY:
        return <TopographyModule />;
       case Module.EXPORT_SHARE:
        return <ResearchModule />;
       case Module.VALIDATION:
        return <ValidationModule />;
      default:
        return <RoadmapModule />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-bg-primary font-sans">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
           <Suspense fallback={<LoadingSpinner />}>
            {showEthicsSplash && <EthicsSplashScreen onClose={handleCloseEthicsSplash} />}
            {!showEthicsSplash && showOnboarding && <OnboardingModule onClose={handleCloseOnboarding} />}
            {!showEthicsSplash && !showOnboarding && renderActiveModule()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
        <UIStateProvider>
            <AppContent />
        </UIStateProvider>
    </DataProvider>
  );
};


export default App;