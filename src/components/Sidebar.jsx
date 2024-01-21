// Sidebar.jsx

import React, { useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { GrAnalytics } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import { FaBars, FaBarsStaggered } from "react-icons/fa6";
import styles from "../scss/Sidebar.module.scss";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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
            Expense Tracker
          </h1>
        )}
      </div>
      <nav className="mt-6">
        <div
          className={`flex items-center py-4 px-6 hover:bg-gray-700 ${styles.navItem}`}
        >
          <MdOutlineDashboard className={`mr-2 ${styles.icon}`} />
          {isCollapsed ? null : "Dashboard"}
        </div>
        <div
          className={`flex items-center py-4 px-6 hover:bg-gray-700 ${styles.navItem}`}
        >
          <GrAnalytics className={`mr-2 ${styles.icon}`} />
          {isCollapsed ? null : "Analysis"}
        </div>
        <div
          className={`flex items-center py-4 px-6 hover:bg-gray-700 ${styles.navItem}`}
        >
          <IoSettingsOutline className={`mr-2 ${styles.icon}`} />
          {isCollapsed ? null : "Settings"}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
