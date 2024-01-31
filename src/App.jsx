import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Analysis } from "./pages/Analysis";
import Sidebar from "./components/Sidebar"; // Import your Sidebar component

const App = () => {
  const token = localStorage.getItem("token");
  return (
    <Router>
      <div className="flex h-screen">
        {/* Include Sidebar here so that it's present on all pages */}
        {token ? <Sidebar /> : null}

        <Routes>
          <Route path="/login" element={<Login />} />

          {token ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analysis" element={<Analysis />} />
              {/* Add more routes as needed */}
            </>
          ) : (
            <Route path="/*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
