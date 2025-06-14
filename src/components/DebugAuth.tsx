import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";

export function DebugAuth() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // 只在开发环境显示
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 9999,
        fontFamily: "monospace",
      }}
    >
      <div>路径: {location.pathname}</div>
      <div>认证状态: {isAuthenticated ? "已登录" : "未登录"}</div>
      <div>用户: {user || "无"}</div>
      <div>localStorage: {localStorage.getItem("cyberguard_auth") || "无"}</div>
    </div>
  );
}
