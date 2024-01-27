import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { FaTrash, FaEdit } from "react-icons/fa";
import "../scss/Dashboard.scss";

export const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenseData, setExpenseData] = useState({
    description: "",
    amount: 0,
  });
  const [incomeData, setIncomeData] = useState({
    description: "",
    amount: 0,
  });

  const userId = localStorage.getItem("UserId");

  const addExpense = async () => {
    try {
      if (!userId || !expenseData.description || !expenseData.amount) {
        console.error(
          "User ID, description, and amount are required for expenses."
        );
        return;
      }

      await axios.post("http://localhost:3000/api/expenses/addExpense", {
        userId,
        ...expenseData,
      });
      fetchExpenses();
      setExpenseData({
        description: "",
        amount: 0,
      });
    } catch (error) {
      if (error.response) {
        console.error("Error adding expense", error.response.data);
      } else {
        console.error("Error adding expense", error.message);
      }
    }
  };

  const addIncome = async () => {
    try {
      if (!userId || !incomeData.description || !incomeData.amount) {
        console.error(
          "UserId, Description, and amount are required for incomes."
        );
        return;
      }

      await axios.post("http://localhost:3000/api/incomes/addIncome", {
        userId,
        ...incomeData,
      });
      fetchIncomes();
      setIncomeData({
        description: "",
        amount: 0,
      });
    } catch (error) {
      console.error("Error adding income", error.response.data);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/expenses/getExpenses",
        { params: { userId } }
      );
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses", error);
    }
  };

  const fetchIncomes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/incomes/getIncomes",
        { params: { userId } }
      );
      setIncomes(response.data);
    } catch (error) {
      console.error("Error fetching incomes", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchIncomes();
  }, []);

  const handleExpenseChange = (e) => {
    setExpenseData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleIncomeChange = (e) => {
    setIncomeData({
      ...incomeData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-200 p-8 overflow-y-auto hide-scrollbar">
        <h1 className="text-2xl font-bold mb-4">Main Content</h1>

        {/* Display Cards */}
        <div className="flex space-x-4 mb-4">
          {/* Expense Card */}
          <div className="flex-1 bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-2">Expenses</h2>
            {expenses.map((expense, index) => (
              <div
                key={index}
                className="mb-4 border-b border-gray-300 pb-2 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold">
                    Description: {expense.description}
                  </p>
                  <p className="text-sm">Amount: {expense.amount}</p>
                </div>
                {/* Delete and Update Icons */}
                <div className="flex items-center">
                  <FaTrash className="text-red-500 cursor-pointer mr-2" />
                  <FaEdit className="text-blue-500 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>

          {/* Income Card */}
          <div className="flex-1 bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-2">Incomes</h2>
            <ul>
              {incomes.map((income, index) => (
                <li
                  key={index}
                  className="mb-4 border-b border-gray-300 pb-2 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      Description: {income.description}
                    </p>
                    <p className="text-sm">Amount: {income.amount}</p>
                  </div>
                  {/* Delete and Update Icons */}
                  <div className="flex items-center">
                    <FaTrash className="text-red-500 cursor-pointer mr-2" />
                    <FaEdit className="text-blue-500 cursor-pointer" />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Total Card */}
          <div className="flex-1 bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-2">Total</h2>
            <p className="text-sm">Total Income: {calculateTotal(incomes)}</p>
            <p className="text-sm">Total Expense: {calculateTotal(expenses)}</p>
            <p className="text-sm font-semibold">
              Difference: {calculateTotal(incomes) - calculateTotal(expenses)}
            </p>
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          {/* Expense Form */}
          <div className="flex-1 bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Add Expense</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addExpense();
              }}
              className="flex flex-col space-y-4"
            >
              {/* Description Dropdown (replace with your actual options) */}
              <label className="flex flex-col">
                <span className="text-sm mb-1">Description:</span>

                <input
                  type="text"
                  name="description"
                  value={expenseData.description}
                  onChange={handleExpenseChange}
                  className="border border-gray-300 p-2 rounded-md"
                />
              </label>
              {/* Amount Input with adjusted width */}
              <label className="flex flex-col">
                <span className="text-sm mb-1">Amount:</span>
                <input
                  type="number"
                  name="amount"
                  value={expenseData.amount}
                  onChange={handleExpenseChange}
                  className="border border-gray-300 p-2 rounded-md"
                />
              </label>
              {/* Submit Button with consistent styling */}
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
              >
                Add Expense
              </button>
            </form>
          </div>

          {/* Income Form */}
          <div className="flex-1 bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Add Income</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addIncome();
              }}
              className="flex flex-col space-y-4"
            >
              {/* Description Dropdown (replace with your actual options) */}
              <label className="flex flex-col">
                <span className="text-sm mb-1">Description:</span>

                <input
                  type="text"
                  name="description"
                  value={incomeData.description}
                  onChange={handleIncomeChange}
                  className="border border-gray-300 p-2 rounded-md"
                />
              </label>
              {/* Amount Input with adjusted width */}
              <label className="flex flex-col">
                <span className="text-sm mb-1">Amount:</span>
                <input
                  type="number"
                  name="amount"
                  value={incomeData.amount}
                  onChange={handleIncomeChange}
                  className="border border-gray-300 p-2 rounded-md"
                />
              </label>
              {/* Submit Button with consistent styling */}
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300"
              >
                Add Income
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="w-80 bg-white p-8">
        <h2 className="text-lg font-semibold mb-4">To-Do List</h2>
      </div>
    </div>
  );
};
