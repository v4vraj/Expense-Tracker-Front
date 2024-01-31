import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { FaTrash, FaEdit } from "react-icons/fa";
import "../scss/Dashboard.scss";

import DeleteModal from "../components/DeleteModal";
import Modal from "../components/Modal";

const BASE_URL = "http://localhost:3000/api";
const EXPENSES_ENDPOINT = "/expenses";
const INCOMES_ENDPOINT = "/incomes";

export const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenseData, setExpenseData] = useState({
    description: "",
    amount: 0,
  });
  const [incomeData, setIncomeData] = useState({ description: "", amount: 0 });
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const openEditModal = (item, isIncome) => {
    if (isIncome) {
      setSelectedIncome(item);
      setSelectedExpense(null); // Reset selectedExpense
    } else {
      setSelectedExpense(item);
      setSelectedIncome(null); // Reset selectedIncome
    }
    setModalOpen(true);
  };

  const openDeleteModal = (item, isIncome) => {
    isIncome ? setSelectedIncome(item) : setSelectedExpense(item);
    setDeleteModalOpen(true);
  };

  const userId = localStorage.getItem("UserId");

  const fetchData = async (endpoint, setData) => {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        params: { userId },
      });

      if (endpoint.includes("/expenses")) {
        setData(response.data);
        console.log(response.data);
      } else if (endpoint.includes("/incomes")) {
        setData(response.data);
      } else {
        // Handle other cases if needed
        setData(response.data);
      }
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}`, error);
    }
  };

  const handleEditSubmit = async (editedData, isIncome) => {
    try {
      const selectedItem = isIncome ? selectedIncome : selectedExpense;
      if (!selectedItem) {
        console.error(
          `No ${isIncome ? "income" : "expense"} selected for editing`
        );
        return;
      }

      const endpoint = isIncome ? INCOMES_ENDPOINT : EXPENSES_ENDPOINT;
      await axios.put(
        `${BASE_URL}${endpoint}/update${isIncome ? "Income" : "Expense"}/${
          selectedItem._id
        }`,
        editedData
      );

      console.log(`${isIncome ? "Income" : "Expense"} updated:`, editedData);
      isIncome
        ? fetchData(`${INCOMES_ENDPOINT}/getIncomes`, setIncomes)
        : fetchData(`${EXPENSES_ENDPOINT}/getExpenses`, setExpenses);
    } catch (error) {
      console.error(`Error updating ${isIncome ? "income" : "expense"}`, error);
    } finally {
      setEditModalOpen(false);
    }
  };

  const handleDeleteSubmit = async (deletedData, isIncome) => {
    try {
      const selectedItem = isIncome ? selectedIncome : selectedExpense;
      if (!selectedItem) {
        console.error(
          `No ${isIncome ? "income" : "expense"} selected for deleting`
        );
        return;
      }

      const endpoint = isIncome ? INCOMES_ENDPOINT : EXPENSES_ENDPOINT;
      await axios.delete(
        `${BASE_URL}${endpoint}/delete${isIncome ? "Income" : "Expense"}/${
          selectedItem._id
        }`
      );

      console.log(`${isIncome ? "Income" : "Expense"} deleted:`, deletedData);
      isIncome
        ? fetchData(`${INCOMES_ENDPOINT}/getIncomes`, setIncomes)
        : fetchData(`${EXPENSES_ENDPOINT}/getExpenses`, setExpenses);
    } catch (error) {
      console.error(`Error deleting ${isIncome ? "income" : "expense"}`, error);
    } finally {
      setDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    fetchData(`${INCOMES_ENDPOINT}/getIncomes`, setIncomes);
    fetchData(`${EXPENSES_ENDPOINT}/getExpenses`, setExpenses);
  }, []);

  const handleInputChange = (e, setData) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleExpenseChange = (e) => {
    handleInputChange(e, setExpenseData);
  };

  const handleIncomeChange = (e) => {
    handleInputChange(e, setIncomeData);
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  const addExpense = async () => {
    try {
      await axios.post(`${BASE_URL}${EXPENSES_ENDPOINT}/addExpense`, {
        userId,
        ...expenseData,
      });
      fetchData(`${EXPENSES_ENDPOINT}/getExpenses`, setExpenses);
    } catch (error) {
      console.error("Error adding expense", error);
    }
  };

  const addIncome = async () => {
    try {
      await axios.post(`${BASE_URL}${INCOMES_ENDPOINT}/addIncome`, {
        userId,
        ...incomeData,
      });
      fetchData(`${INCOMES_ENDPOINT}/getIncomes`, setIncomes);
    } catch (error) {
      console.error("Error adding income", error);
    }
  };

  return (
    <div className="flex-1 bg-gray-200 p-8 overflow-y-auto hide-scrollbar">
      {/* Display Cards */}
      <div className="flex space-x-4 mb-4">
        {/* Expense Card */}
        <div className="flex-1 bg-white p-4 rounded-md shadow-md scrollable-card">
          <h2 className="text-lg font-semibold mb-2 sticky-heading">
            Expenses
          </h2>
          {expenses.map((item, index) => (
            <div
              key={index}
              className="mb-4 border-b border-gray-300 pb-2 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold">
                  Description: {item.description}
                </p>
                <p className="text-sm">Amount: {item.amount}</p>
              </div>
              {/* Delete and Update Icons */}
              <div className="flex items-center">
                <FaTrash
                  className="text-red-500 cursor-pointer mr-2"
                  onClick={() => openDeleteModal(item, false)}
                />
                <FaEdit
                  className="text-blue-500 cursor-pointer"
                  onClick={() => openEditModal(item, false)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Income Card */}
        <div className="flex-1 bg-white p-4 rounded-md shadow-md scrollable-card">
          <h2 className="text-lg font-semibold mb-2 sticky-heading">Incomes</h2>
          {incomes.map((item, index) => (
            <div
              key={index}
              className="mb-4 border-b border-gray-300 pb-2 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold">
                  Description: {item.description}
                </p>
                <p className="text-sm">Amount: {item.amount}</p>
              </div>
              {/* Delete and Update Icons */}
              <div className="flex items-center">
                <FaTrash
                  className="text-red-500 cursor-pointer mr-2"
                  onClick={() => openDeleteModal(item, true)}
                />
                <FaEdit
                  className="text-blue-500 cursor-pointer"
                  onClick={() => openEditModal(item, true)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total Card */}
        <div className="flex-1 bg-white p-4 rounded-md shadow-md scrollable-card">
          <h2 className="text-lg font-semibold mb-2 sticky-heading">Total</h2>
          <p className="text-sm">Total Income: {calculateTotal(incomes)}</p>
          <p className="text-sm">Total Expense: {calculateTotal(expenses)}</p>
          <p className="text-sm font-semibold">
            Difference: {calculateTotal(incomes) - calculateTotal(expenses)}
          </p>
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSubmit={handleDeleteSubmit}
        itemData={selectedExpense}
        isIncome={false}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleEditSubmit}
        itemData={selectedIncome || selectedExpense}
        isIncome={selectedIncome ? true : false}
      />
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
  );
};

export default Dashboard;
