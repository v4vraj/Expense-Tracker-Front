import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Login } from "./pages/Login";
import Dashboard from "./pages/dashboard";
import { Analysis } from "./pages/Analysis";
import Sidebar from "./components/Sidebar";
import { Budget } from "./pages/Budget";
import { NewDasboard } from "./pages/NewDashboard";
import { Splitwise } from "./pages/Splitwise";
import io from "socket.io-client";
import { Group } from "./pages/Group";
import "./App.css";

const App = () => {
  const token = localStorage.getItem("token");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(
      "https://expense-tracker-backend-g51m.onrender.com  "
    );
    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return (
    <Router>
      <div className="flex h-screen main-screen">
        {token ? <Sidebar /> : null}
        <Routes>
          <Route path="/login" element={<Login />} />
          {token ? (
            <>
              <Route path="/dashboard" element={<NewDasboard />} />
              <Route path="/Records" element={<Dashboard />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/budget" element={<Budget />} />
              <Route
                path="/splitwise"
                element={<Splitwise socket={socket} />}
              />
              <Route path="/group/:code" element={<Group socket={socket} />} />
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
