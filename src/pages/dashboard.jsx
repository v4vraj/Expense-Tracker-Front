import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { FaTrash, FaEdit } from "react-icons/fa";
import { FcAlarmClock } from "react-icons/fc";
import "../scss/Dashboard.scss";
import ReactToggle from "react-toggle";
import "react-toggle/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DeleteModal from "../components/DeleteModal";
import Modal from "../components/Modal";
import DateModal from "../components/DateModal";

const BASE_URL = "http://localhost:3000/api";
const EXPENSES_ENDPOINT = "/expenses";
const INCOMES_ENDPOINT = "/incomes";

export const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenseData, setExpenseData] = useState({
    description: "",
    amount: 0,
    status: false, // Default status is false (off)
    timestamp: new Date(),
  });
  const [incomeData, setIncomeData] = useState({
    description: "",
    amount: 0,
    status: false, // Default status is false (off)
    timestamp: new Date(),
  });
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFormDisabled, setFormDisabled] = useState(false);
  const [isDateModalOpen, setDateModalOpen] = useState(false);
  const [reminderDate, setReminderDate] = useState(new Date());

  const openEditModal = (item, isIncome) => {
    if (isIncome) {
      console.log(item);
      setSelectedIncome(item);
      setSelectedExpense(null);
      setFormDisabled(true);
    } else {
      setSelectedExpense(item);
      setSelectedIncome(null);
      setFormDisabled(true);
    }
    setModalOpen(true);
  };

  const openDeleteModal = (item, isIncome) => {
    if (isIncome) {
      setSelectedIncome(item);
      setSelectedExpense(null);
      setFormDisabled(true);
    } else {
      setSelectedIncome(null);
      setSelectedExpense(item);
      setFormDisabled(true);
    }
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setFormDisabled(true);
  };

  const closeEditModal = () => {
    setModalOpen(false);
    setFormDisabled(false); // Reset isFormDisabled when the modal is closed
  };

  const closeDateModal = () => {
    setDateModalOpen(false);
    setFormDisabled(false);
  };

  const handleSelectExpense = (expense) => {
    setSelectedExpense(expense);
    // Other logic as needed
    setDateModalOpen(true);
    setFormDisabled(true);
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;
  const userEmail = user.email;

  const fetchData = async (endpoint, setData) => {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        params: { userId },
      });

      if (endpoint.includes("/expenses")) {
        setData(response.data);
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
      console.log("selectedItem---------", selectedIncome);
      if (!selectedItem) {
        console.error(
          `No ${isIncome ? "income" : "expense"} selected for editing`
        );
        return;
      }
      console.log("selectedItem._id", selectedItem._id);
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
      setModalOpen(false);
    }
  };

  const handleDeleteSubmit = async (deletedData, isIncome) => {
    try {
      console.log("isIncome", isIncome);
      const selectedItem = isIncome ? selectedIncome : selectedExpense;
      console.log(selectedItem);
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
  }, []); // Add other dependencies as needed

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
        timestamp: expenseData.timestamp.toISOString(),
      });
      fetchData(`${EXPENSES_ENDPOINT}/getExpenses`, setExpenses);
      setExpenseData({
        description: "",
        amount: 0,
        status: false, // Default status is false (off)
        timestamp: new Date(),
      });
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
      setIncomeData({
        description: "",
        amount: 0,
        status: false, // Default status is false (off)
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error adding income", error);
    }
  };

  return (
    <div className="flex-1 bg-gray-200 p-8 overflow-y-auto hide-scrollbar ">
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
                <p className="text-sm">Timestamp: {item.timestamp}</p>
                <p className="text-sm">
                  Status: {item.status ? "Active" : "Inactive"}
                </p>
              </div>
              {/* Delete and Update Icons */}
              <div className="flex items-center">
                <FcAlarmClock
                  className="text-red-500 cursor-pointer mr-2"
                  onClick={() => handleSelectExpense(item)}
                />
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
                <p className="text-sm">Timestamp: {item.timestamp}</p>
                <p className="text-sm">
                  Status: {item.status ? "Active" : "Inactive"}
                </p>
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
        onClose={closeDeleteModal}
        onSubmit={() =>
          handleDeleteSubmit(
            selectedExpense || selectedIncome,
            selectedIncome ? true : false
          )
        }
        title={selectedIncome ? "Income" : "Expense"}
        isIncome={selectedIncome ? true : false}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeEditModal}
        onSubmit={handleEditSubmit}
        itemData={selectedIncome || selectedExpense}
        isIncome={selectedIncome ? true : false}
      />

      <DateModal
        isOpen={isDateModalOpen}
        onClose={closeDateModal}
        onSubmit={() => {
          console.log("Reminder set for:", reminderDate);
          setDateModalOpen(false);
        }}
        expenseTitle={selectedExpense ? selectedExpense.description : ""}
        userEmail={userEmail}
      />

      <div className="flex space-x-4 mb-4">
        {/* Expense Form */}
        <div className={`flex-1 bg-white p-4 rounded-md shadow-md `}>
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
            <label style={{ display: "flex", alignItems: "center" }}>
              <ReactToggle
                id="statusToggle"
                checked={expenseData.status}
                onChange={() => {
                  setExpenseData((prevData) => ({
                    ...prevData,
                    status: !prevData.status,
                  }));
                }}
                disabled={isFormDisabled}
              />
              <span style={{ marginLeft: "8px" }}>
                {expenseData.status ? "Active" : "Inactive"}
              </span>
            </label>

            <label className="flex flex-col">
              <span className="text-sm mb-1">Date:</span>
              <div style={{ display: "flex", alignItems: "center" }}>
                <DatePicker
                  selected={expenseData.timestamp}
                  onChange={(date) =>
                    setExpenseData((prevData) => ({
                      ...prevData,
                      timestamp: date,
                    }))
                  }
                  disabled={isFormDisabled}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="border border-gray-300 p-2 rounded-md"
                />
              </div>
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
        <div className={`flex-1 bg-white p-4 rounded-md shadow-md `}>
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
            <label style={{ display: "flex", alignItems: "center" }}>
              <ReactToggle
                id="statusToggle"
                checked={incomeData.status}
                onChange={() => {
                  setIncomeData((prevData) => ({
                    ...prevData,
                    status: !prevData.status,
                  }));
                }}
                disabled={isFormDisabled}
              />
              <span style={{ marginLeft: "8px" }}>
                {incomeData.status ? "Active" : "Inactive"}
              </span>
            </label>

            <label className="flex flex-col">
              <span className="text-sm mb-1">Date:</span>

              <div style={{ display: "flex", alignItems: "center" }}>
                <DatePicker
                  selected={incomeData.timestamp}
                  onChange={(date) =>
                    setIncomeData((prevData) => ({
                      ...prevData,
                      timestamp: date,
                    }))
                  }
                  disabled={isFormDisabled}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="border border-gray-300 p-2 rounded-md"
                />
              </div>
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
