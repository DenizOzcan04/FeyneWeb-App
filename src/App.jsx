import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* PUBLIC: Home, About, Login -> Navbar var, Layout yok */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main className="content"><Home /></main>
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <main className="content"><About /></main>
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <Login />
              </>
            }
          />

          {/* PROTECTED: admin sayfaları -> Layout var, Navbar yok */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Layout><Tasks /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout><Settings /></Layout>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <main className="content"><NotFound /></main>
              </>
            }
          />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme={document.documentElement.classList.contains("dark") ? "dark" : "light"}
      />
    </>
  );
}

export default App;
