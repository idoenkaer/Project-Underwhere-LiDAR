import React, { Suspense, lazy, useState } from 'react';
import { Module } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { UIStateProvider, useUIStateContext } from './components/contexts/UIStateContext';
import { DataProvider } from './components/contexts/DataContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ChatBubbleLeftRightIcon } from './components/icons/ChatBubbleLeftRightIcon';
import FeedbackModal from './components/common/FeedbackModal';
import ToastContainer from './components/common/ToastContainer';

// Lazy load all modules
const RoadmapModule = lazy(() => import('./components/modules/RoadmapModule'));
const ScanCalibrateModule = lazy(() => import('./components/modules/ScanCalibrateModule'));
const TopographyModule = lazy(() => import('./components/modules/TopographyModule'));
const EnvironmentalModule = lazy(() => import('./components/modules/EnvironmentalModule'));
const BiologicalModule = lazy(() => import('./components/modules/BiologicalModule'));
const PhysicsModule = lazy(() => import('./components/modules/PhysicsModule'));
const SpaceTimeModule = lazy(() => import('./components/modules/SpaceTimeModule'));
const QuantumModule = lazy(() => import('./components/modules/QuantumModule'));
const AIDiscoveryModule = lazy(() => import('./components/modules/AIDiscoveryModule'));
const ResearchModule = lazy(() => import('./components/modules/ResearchModule'));
const ValidationModule = lazy(() => import('./components/modules/ValidationModule'));
const FieldTestModule = lazy(() => import('./components/modules/FieldTestModule'));
const DebugModule = lazy(() => import('./components/modules/DebugModule'));
const SettingsModule = lazy(() => import('./components/modules/SettingsModule'));
const ActivityModule = lazy(() => import('./components/modules/ActivityModule'));
const PluginsModule = lazy(() => import('./components/modules/PluginsModule'));
const OnboardingModule = lazy(() => import('./components/common/OnboardingModule'));
const EthicsSplashScreen = lazy(() => import('./components/common/EthicsSplashScreen'));
const PlaceholderModule = lazy(() => import('./components/modules/PlaceholderModule'));


const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-bright"></div>
    </div>
);

const AppContent: React.FC = () => {
  const { activeModule, showOnboarding, handleCloseOnboarding, showEthicsSplash, handleCloseEthicsSplash, isHighContrast, reduceMotion, isFeedbackModalOpen, openFeedbackModal, closeFeedbackModal } = useUIStateContext();

  const renderActiveModule = () => {
    switch (activeModule) {
      case Module.ROADMAP:
        return <RoadmapModule />;
      case Module.SCAN_CALIBRATE:
        return <ScanCalibrateModule />;
      case Module.TOPOGRAPHY:
        return <TopographyModule />;
      case Module.ENVIRONMENTAL:
        return <EnvironmentalModule />;
      case Module.BIOLOGICAL:
        return <BiologicalModule />;
      case Module.PHYSICS:
        return <PhysicsModule />;
      case Module.SPACETIME:
        return <SpaceTimeModule />;
      case Module.QUANTUM:
        return <QuantumModule />;
      case Module.AI_DISCOVERY:
        return <AIDiscoveryModule />;
       case Module.EXPORT_SHARE:
        return <ResearchModule />;
       case Module.VALIDATION:
        return <ValidationModule />;
       case Module.FIELD_TEST:
        return <FieldTestModule />;
       case Module.DEBUG:
        return <DebugModule />;
       case Module.SETTINGS:
        return <SettingsModule />;
      case Module.ACTIVITY:
        return <ActivityModule />;
      case Module.PLUGINS:
        return <PluginsModule />;
      default:
        return <RoadmapModule />;
    }
  };

  const themeClasses = `${isHighContrast ? 'theme-high-contrast' : ''} ${reduceMotion ? 'motion-reduced' : ''}`;

  return (
    <div className={`flex h-screen w-full bg-bg-primary font-sans ${themeClasses}`}>
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
       <ToastContainer />
       {!showEthicsSplash && !showOnboarding && (
          <button
              onClick={openFeedbackModal}
              className="fixed bottom-6 right-6 z-40 p-4 bg-green-bright text-bg-primary rounded-full shadow-lg hover:bg-green-primary transition-transform hover:scale-110"
              title="Submit Feedback"
          >
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
          </button>
      )}
      {isFeedbackModalOpen && <FeedbackModal onClose={closeFeedbackModal} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <DataProvider>
          <UIStateProvider>
              <AppContent />
          </UIStateProvider>
      </DataProvider>
    </ErrorBoundary>
  );
};


export default App;