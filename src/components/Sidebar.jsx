// Sidebar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { GrAnalytics } from "react-icons/gr";
import { FaSlideshare } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { FaBars, FaBarsStaggered } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { GiReceiveMoney } from "react-icons/gi";
import styles from "../scss/Sidebar.module.scss";
import axios from "axios";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [groups, setGroups] = useState([]);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const AplhaUser = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserId");
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("/api/groups/getGroups"); // Adjust the API endpoint
        console.log(response.data);
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

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
        <Link to="/Records" className={styles.navLink}>
          <div
            className={`flex items-center py-4 px-6 hover:bg-gray-700 ${styles.navItem}`}
          >
            <MdOutlineDashboard className={`mr-2 ${styles.icon}`} />
            {isCollapsed ? null : "Records"}
          </div>
        </Link>
        {/* <Link to="/analysis" className={styles.navLink}>
          <div
            className={`flex items-center py-4 px-6 hover:bg-gray-700 ${styles.navItem}`}
          >
            <GrAnalytics className={`mr-2 ${styles.icon}`} />
            {isCollapsed ? null : "Analysis"}
          </div>
        </Link> */}
        <Link to="/budget" className={styles.navLink}>
          <div
            className={`flex items-center py-4 px-6 hover:bg-gray-700 ${styles.navItem}`}
          >
            <GiReceiveMoney className={`mr-2 ${styles.icon}`} />
            {isCollapsed ? null : "Budget"}
          </div>
        </Link>
        <Link to="/splitwise" className={styles.navLink}>
          <div
            className={`flex items-center py-4 px-6 hover:bg-gray-700 ${styles.navItem}`}
          >
            <FaSlideshare className={`mr-2 ${styles.icon}`} />
            {isCollapsed ? null : "Splitwise"}
          </div>
        </Link>
        {groups.map((group) => {
          // console.log(user.email);
          const userIsInGroup = group.users.some(
            (user) => user.email === AplhaUser.email
          );
          // console.log(userIsInGroup);
          // Render the link only if the user is in the group
          return userIsInGroup ? (
            <Link
              to={`/group/${group.code}`}
              className={styles.navLink}
              key={group.code}
            >
              <div
                className={`flex items-center py-4 px-6 hover:bg-gray-700 ${styles.navItem}`}
              >
                <MdOutlineDashboard className={`mr-2 ${styles.icon}`} />
                {!isCollapsed && `Group ${group.code}`}
              </div>
            </Link>
          ) : null;
        })}

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
