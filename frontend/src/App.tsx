import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { OverviewPage } from './components/overview/OverviewPage';
import { InfrastructureMapPage } from './components/map/InfrastructureMapPage';
import { AssetRegistryPage } from './components/assets/AssetRegistryPage';
import { AssetMemoryDetailPage } from './components/assets/AssetMemoryDetailPage';
import { MaintenanceHistoryPage } from './components/maintenance/MaintenanceHistoryPage';
import { AIPredictionsPage } from './components/predictions/AIPredictionsPage';
import { RiskAnalysisPage } from './components/risk/RiskAnalysisPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { CommandPaletteModal } from './components/common/Modals';

// Citizen Experience
import { CitizenNavbar } from './components/citizen/CitizenNavbar';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { ReportIssuePage } from './components/citizen/ReportIssuePage';
import { MyComplaintsPage } from './components/citizen/MyComplaintsPage';
import { CommunityInsightsPage } from './components/citizen/CommunityInsightsPage';

// Municipal Officer Experience
import { MunicipalOperationsDashboard } from './components/officer/MunicipalOperationsDashboard';
import { RealTimeComplaintAlert } from './components/officer/RealTimeComplaintAlert';
import { AuthModal } from './components/auth/AuthModal';
import { LoginPage } from './components/auth/LoginPage';

const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    currentUserRole,
    citizenActiveTab,
    activePage,
    setIsCommandPaletteOpen
  } = useApp();

  // Global keyboard shortcut for search palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCommandPaletteOpen]);

  // Citizen Tab Renderer
  const renderCitizenContent = () => {
    switch (citizenActiveTab) {
      case 'dashboard':
        return <CitizenDashboard />;
      case 'report':
        return <ReportIssuePage />;
      case 'my-complaints':
      case 'detail':
        return <MyComplaintsPage />;
      case 'community':
        return <CommunityInsightsPage />;
      default:
        return <CitizenDashboard />;
    }
  };

  // Municipal Officer Page Renderer
  const renderOfficerPage = () => {
    switch (activePage) {
      case 'operations':
        return <MunicipalOperationsDashboard />;
      case 'overview':
        return <OverviewPage />;
      case 'map':
        return <InfrastructureMapPage />;
      case 'registry':
        return <AssetRegistryPage />;
      case 'detail':
        return <AssetMemoryDetailPage />;
      case 'maintenance':
        return <MaintenanceHistoryPage />;
      case 'prediction':
        return <AIPredictionsPage />;
      case 'risk':
        return <RiskAnalysisPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <MunicipalOperationsDashboard />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-[#F5F7FA] text-[#172B4D] dark:bg-[#0B1220] dark:text-[#F1F5F9] font-sans antialiased selection:bg-blue-500 selection:text-white">
      {currentUserRole === 'citizen' ? (
        /* --- CITIZEN DASHBOARD EXPERIENCE --- */
        <div className="flex flex-col min-h-screen">
          <CitizenNavbar />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {renderCitizenContent()}
          </main>
        </div>
      ) : (
        /* --- MUNICIPAL OFFICER EXPERIENCE --- */
        <div className="flex h-screen w-screen overflow-hidden">
          {/* Left Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
            <TopNav />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F5F7FA] dark:bg-[#0B1220] transition-colors">
              <div className="max-w-7xl mx-auto">
                {renderOfficerPage()}
              </div>
            </main>
          </div>

          {/* Real-time Officer Alert Popup */}
          <RealTimeComplaintAlert />
        </div>
      )}

      {/* Global Modals */}
      <AuthModal />
      <CommandPaletteModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
