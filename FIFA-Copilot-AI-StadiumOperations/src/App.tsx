import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthProvider } from '@/hooks/useAuth';
import { DataProvider } from '@/hooks/useData';
import { PageLoader } from '@/components/shared/LoadingState';
import { LoginPage } from '@/pages/LoginPage';

const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((module) => ({ default: module.DashboardPage }))
);
const OperationsPage = lazy(() =>
  import('@/pages/OperationsPage').then((module) => ({ default: module.OperationsPage }))
);
const IncidentsPage = lazy(() =>
  import('@/pages/IncidentsPage').then((module) => ({ default: module.IncidentsPage }))
);
const CopilotPage = lazy(() =>
  import('@/pages/CopilotPage').then((module) => ({ default: module.CopilotPage }))
);
const MemoryPage = lazy(() =>
  import('@/pages/MemoryPage').then((module) => ({ default: module.MemoryPage }))
);
const ReportsPage = lazy(() =>
  import('@/pages/ReportsPage').then((module) => ({ default: module.ReportsPage }))
);
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((module) => ({ default: module.SettingsPage }))
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <DataProvider>
                  <AppLayout />
                </DataProvider>
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route
              path="/operations"
              element={
                <Suspense fallback={<PageLoader />}>
                  <OperationsPage />
                </Suspense>
              }
            />
            <Route
              path="/incidents"
              element={
                <Suspense fallback={<PageLoader />}>
                  <IncidentsPage />
                </Suspense>
              }
            />
            <Route
              path="/copilot"
              element={
                <Suspense fallback={<PageLoader />}>
                  <CopilotPage />
                </Suspense>
              }
            />
            <Route
              path="/memory"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MemoryPage />
                </Suspense>
              }
            />
            <Route
              path="/reports"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ReportsPage />
                </Suspense>
              }
            />
            <Route
              path="/settings"
              element={
                <Suspense fallback={<PageLoader />}>
                  <SettingsPage />
                </Suspense>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
