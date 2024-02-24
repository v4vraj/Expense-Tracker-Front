// Sidebar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { GrAnalytics } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import { FaBars, FaBarsStaggered } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { GiReceiveMoney } from "react-icons/gi";
import styles from "../scss/Sidebar.module.scss";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserId");
  };

  return (
    <div
      className={`bg-gray-800 text-white ${styles.sidebar} ${
        isCollapsed ? styles.collapsed : ""
      }`}
    >
      <div className={`p-4 ${styles.header}`} onClick={toggleSidebar}>
        {isCollapsed ? (
          <FaBars className={`cursor-pointer ${styles.icon}`} />
        ) : (
          <h1 className="text-2xl font-bold flex items-center">
            <FaBarsStaggered className={`mr-2 cursor-pointer ${styles.icon}`} />
            xpense Tracker
          </h1>
        )}
      </div>
      <nav className="mt-6">
        <Link to="/dashboard" className={styles.navLink}>
          <div
            className={`flex items-center py-4 px-6 hover:bg-gray-700 ${styles.navItem}`}
          >
            <MdOutlineDashboard className={`mr-2 ${styles.icon}`} />
            {isCollapsed ? null : "Dashboard"}
          </div>
        </Link>
        <Link to="/analysis" className={styles.navLink}>
          <div
            className={`flex items-center py-4 px-6 hover:bg-gray-700 ${styles.navItem}`}
          >
            <GrAnalytics className={`mr-2 ${styles.icon}`} />
            {isCollapsed ? null : "Analysis"}
          </div>
        </Link>
        <Link to="/budget" className={styles.navLink}>
          <div
            className={`flex items-center py-4 px-6 hover:bg-gray-700 ${styles.navItem}`}
          >
            <GiReceiveMoney className={`mr-2 ${styles.icon}`} />
            {isCollapsed ? null : "Budget"}
          </div>
        </Link>
        <Link to="/settings" className={styles.navLink}>
          <div
            className={`flex items-center py-4 px-6 hover:bg-gray-700 ${styles.navItem}`}
          >
            <IoSettingsOutline className={`mr-2 ${styles.icon}`} />
            {isCollapsed ? null : "Settings"}
          </div>
        </Link>
      </nav>

      {/* Logout Button */}
      <div
        className={`flex items-center justify-start py-4 px-6 hover:bg-gray-700 cursor-pointer ${styles.navItem}`}
        onClick={handleLogout}
      >
        <FiLogOut className={`mr-2 ${styles.icon}`} />
        {isCollapsed ? null : "Logout"}
      </div>
    </div>
  );
};

export default Sidebar;
