// Splitwise.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "../scss/Splitwise.scss";

const socket = io("http://localhost:3000");

export const Splitwise = () => {
  const [groupCode, setGroupCode] = useState("");
  const [joinGroupCode, setJoinGroupCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;
  const userEmail = user.email;
  useEffect(() => {
    socket.on("groupCreated", (data) => {
      console.log("Group created:", data);
      setGroupCode(data.code);
      navigate(`/group/${data.code}`);
    });

    socket.on("userJoined", (data) => {
      console.log("User joined:", data);
    });

    return () => {
      socket.off("groupCreated");
      socket.off("userJoined");
    };
  }, [navigate]);

  const generateRandomCode = () => {
    const min = 100000;
    const max = 999999;

    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomCode;
  };

  const handleCreateGroup = async () => {
    try {
      const code = generateRandomCode();
      console.log(code);

      if (!groupName) {
        console.error("Group name is required");
        return;
      }

      const group = {
        groupName: groupName,
        code: code,
        createdBy: userId,
        users: [{ userId: userId, email: userEmail }],
      };

      const response = await axios.post("/api/groups/createGroup", group);

      if (response.status === 201) {
        const data = response.data;
        setGroupCode(data.code);
        socket.emit("groupCreated", { code: data.code });
        joinGroup(data.code);
      } else {
        console.error("Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleJoinGroup = async () => {
    try {
      const response = await axios.post(`/api/groups/joinGroup/${joinGroup}`, {
        code: joinGroupCode,
        userId: userId,
        email: userEmail,
      });

      if (response.status === 200) {
        const { users } = response.data;

        const joinedUser = users.find((user) => user.userId === userId);

        if (joinedUser) {
          console.log(`User joined group with code: ${joinGroupCode}`);
          console.log(`User's email: ${joinedUser.email}`);
          socket.emit("userJoined", {
            code: joinGroupCode,
            userEmail: joinedUser.email,
          });
        } else {
          console.error("User details not found in the response");
        }
      } else {
        console.error("Failed to join group");
      }
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const joinGroup = (code) => {
    console.log(`User joined group with code: ${code}`);
  };

  return (
    <div className="flex items-center justify-center h-screen mx-auto">
      <div className="splitwise-box bg-white p-8 shadow-md rounded-md">
        <h2 className="text-lg font-semibold mb-4">Create Group</h2>
        <label className="mb-2 block">
          Group Name:
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleCreateGroup}
        >
          Create Group
        </button>
        {groupCode && <p className="mt-4">Group Code: {groupCode}</p>}
      </div>

      <div className="splitwise-box bg-white p-8 shadow-md rounded-md ml-4">
        <h2 className="text-lg font-semibold mb-4">Join Group</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label className="mb-2 block">
            Group Code:
            <input
              type="text"
              value={joinGroupCode}
              onChange={(e) => setJoinGroupCode(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </label>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded"
            onClick={handleJoinGroup}
          >
            Join Group
          </button>
        </form>
      </div>
    </div>
  );
};
