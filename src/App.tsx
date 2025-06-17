import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navigation } from "@/components/Navigation";
import { ToastContainer } from "@/components/ui/toast";
import { SystemStatusNotification } from "@/components/ui/SystemStatusNotification";
import { ApiConnectionTest } from "@/components/ApiConnectionTest";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
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
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg,
          rgb(var(--neutral-900)) 0%,
          rgb(var(--neutral-800)) 25%,
          rgb(var(--brand-darkest)) 50%,
          rgb(var(--neutral-800)) 75%,
          rgb(var(--neutral-900)) 100%)`,
        color: `rgb(var(--brand-lightest))`,
      }}
    >
      {/* 动态背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 25% 25%, rgba(var(--brand-primary), 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, rgba(var(--brand-accent), 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 50% 10%, rgba(var(--brand-light), 0.06) 0%, transparent 50%)`,
            animation: "backgroundShift 25s ease-in-out infinite",
          }}
        />

        {/* 装饰粒子 */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              backgroundColor: [
                `rgb(var(--brand-lightest))`,
                `rgb(var(--brand-accent))`,
                `rgb(var(--brand-light))`,
              ][i % 3],
              borderRadius: "50%",
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      <Navigation />
      <main
        className="lg:ml-64 min-h-screen relative z-10 backdrop-blur-sm"
        style={{
          background: `linear-gradient(135deg,
            rgba(var(--neutral-900), 0.3) 0%,
            rgba(var(--brand-darkest), 0.2) 100%)`,
        }}
      >
        {children}
      </main>
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
              <Dashboard />
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
        <SystemStatusNotification />
        <DebugAuth />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
