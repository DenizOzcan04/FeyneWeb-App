import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const authed = !!localStorage.getItem("token"); 
  if (!authed) return <Navigate to="/login" replace />;
  return children;
}
