import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Login } from "./pages/Login";
import Dashboard from "./pages/dashboard";
import { Analysis } from "./pages/Analysis";
import Sidebar from "./components/Sidebar"; // Import your Sidebar component
import { Budget } from "./pages/Budget";

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
              <Route path="/budget" element={<Budget />} />
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
