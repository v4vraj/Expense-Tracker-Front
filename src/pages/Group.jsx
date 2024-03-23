import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../scss/Group.scss";

export const Group = () => {
  const { code } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [balances, setBalances] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [transactions, setTransactions] = useState([]);

  const handlePaidByChange = (e) => {
    setPaidBy(e.target.value);
  };

  const handleUserSelect = (e) => {
    const selectedUserId = e.target.value;
    const selectedUser = availableUsers.find(
      (user) => user._id === selectedUserId
    );
    if (selectedUser) {
      setSelectedUsers([...selectedUsers, selectedUser.email]);
      setAvailableUsers(
        availableUsers.filter((user) => user._id !== selectedUserId)
      );
    }
  };

  const handleUserRemove = (email) => {
    setSelectedUsers(selectedUsers.filter((user) => user !== email));
    const removedUser = group.users.find((user) => user.email === email);
    if (removedUser) {
      setAvailableUsers([...availableUsers, removedUser]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      group: group._id,
      amount: amount,
      description: description,
      paidBy: paidBy,
      splitBetween: selectedUsers,
    };
    await axios.post(`/api/groupTransaction/createTransactions`, data);
    fetchGroupAndBalances();
  };

  const fetchGroupAndBalances = async () => {
    try {
      const groupResponse = await axios.get(`/api/groups/getGroup/${code}`);
      setGroup(groupResponse.data);
      setAvailableUsers(groupResponse.data.users);

      const groupId = groupResponse.data._id;
      const userEmail = user.email;
      const balancesResponse = await axios.get(
        `/api/groupTransaction/balances/${groupId}`,
        { params: { userEmail } }
      );
      setBalances(balancesResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching group and balances:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGroupAndBalances();
  }, [code]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionsResponse = await axios.get(
          `/api/groupTransaction/groupTransactions/${group._id}`
        );
        console.log(transactionsResponse.data);
        setTransactions(transactionsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    if (group && group._id) {
      fetchTransactions();
    }
  }, [group]);

  if (loading || !group) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-200 p-8 overflow-y-auto" style={{ width: "100%" }}>
      <h3 className="text-lg font-semibold mb-4">Group {group.groupName}</h3>
      {balances && (
        <div
          className="mt-4 bg-gray-100 p-4 rounded-md"
          style={{ width: "fit-content" }}
        >
          <h3 className="text-lg font-semibold mb-4">User Balances</h3>
          <div className="mb-4">
            <p>
              <span
                className={`font-semibold ${
                  balances.totalBalance < 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {balances.totalBalance < 0
                  ? "You owe Balance"
                  : "You are owed Balance"}{" "}
                {balances.totalBalance}
              </span>
            </p>
          </div>
          <div className="mb-4">
            <p className="mb-1"></p>
            <ul>
              {balances.owes.map((user) => (
                <li key={user.user} className="flex items-center">
                  <span className="mr-2">You owe from {user.user}:</span>{" "}
                  <span className="text-red-600">{user.amount}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <ul>
              {balances.owedFrom.map((user) => (
                <li key={user.user} className="flex items-center">
                  <span className="mr-2">{user.user} owes you:</span>{" "}
                  <span className="text-green-600">{user.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-4">Transactions</h3>
        {transactions && (
          <div
            className="mb-4 bg-white p-4 rounded-md shadow-md overflow-auto"
            style={{ height: "400px" }}
          >
            <ul>
              {transactions
                .filter(
                  (transaction) =>
                    transaction.source === user.email ||
                    transaction.destination === user.email
                )
                .slice()
                .reverse()
                .map((transaction, index) =>
                  transaction.transactions.map((t, i) => (
                    <li key={index + "-" + i} className="mb-4 border-b pb-4">
                      <div className="flex flex-wrap">
                        <div className="w-full md:w-1/3 mb-2 md:mb-0">
                          <span className="font-semibold">Source:</span>{" "}
                          {transaction.source}
                        </div>
                        <div className="w-full md:w-1/3 mb-2 md:mb-0">
                          <span className="font-semibold">Timestamp:</span>{" "}
                          {new Date(t.timestamp).toLocaleString()}
                        </div>
                        <div className="w-full md:w-1/3">
                          <span className="font-semibold">Destination:</span>{" "}
                          {transaction.destination}
                        </div>
                      </div>
                      <div className="w-full mt-2">
                        <span className="font-semibold">Description:</span>{" "}
                        {t.description}
                      </div>
                      <div className="w-full">
                        <span className="font-semibold">Amount:</span>{" "}
                        {t.amount}
                      </div>
                    </li>
                  ))
                )}
            </ul>
          </div>
        )}
      </div>

      <div
        className="flex-1 bg-white p-4 rounded-md shadow-md "
        style={{ width: "50%" }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label htmlFor="description" className="flex flex-col">
            <span className="text-sm mb-1">Description:</span>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
            />
          </label>
          <label htmlFor="amount" className="flex flex-col">
            <span className="text-sm mb-1">Amount:</span>
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <div className="mb-4">
            <label htmlFor="paidBy" className="flex flex-col">
              <span className="text-sm mb-1">Paid by:</span>
            </label>
            <select
              id="paidBy"
              value={paidBy}
              onChange={handlePaidByChange}
              className="border border-gray-300 p-2 rounded-md"
            >
              {group.users.map((user) => (
                <option key={user._id} value={user.email}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="selectUser" className="flex flex-col">
              <span className="text-sm mb-1">Select Users:</span>
            </label>
            <div className="flex items-center space-x-2">
              {selectedUsers.map((user) => (
                <div
                  key={user}
                  className="flex items-center bg-gray-200 px-2 rounded-md"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {user}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUserRemove(user)}
                    className="ml-2 text-sm font-medium text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <select
                id="selectUser"
                value=""
                onChange={handleUserSelect}
                className="border border-gray-300 p-2 rounded-md"
              >
                <option value="" disabled>
                  Select a user
                </option>
                {availableUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Group;
