import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navigation } from "@/components/Navigation";
import { ToastContainer } from "@/components/ui/toast";
import Index from "@/pages/Index";
import Alerts from "@/pages/Alerts";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import UserManagement from "@/pages/UserManagement";
import SystemLogs from "@/pages/SystemLogs";
import ThreatIntelligence from "@/pages/ThreatIntelligence";
import AssetManagement from "@/pages/AssetManagement";
import ApiKeys from "@/pages/ApiKeys";
import SituationDisplay from "@/pages/SituationDisplay";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { DebugAuth } from "@/components/DebugAuth";

// 受保护的布局组件
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#f8fafc", // BUSINESS_COLORS.ui.background.card
        color: "#0f172a", // BUSINESS_COLORS.ui.text.primary
      }}
    >
      <Navigation />
      <main className="lg:ml-64 min-h-screen">{children}</main>
    </div>
  );
}
// 主应用布局组件
function AppLayout() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Index />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/situation"
        element={
          <ProtectedRoute>
            <SituationDisplay />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alerts"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Alerts />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Reports />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Settings />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <UserManagement />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <SystemLogs />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/threat-intelligence"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ThreatIntelligence />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <AssetManagement />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/api-keys"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ApiKeys />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <NotFound />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
        <ToastContainer />
        <DebugAuth />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
