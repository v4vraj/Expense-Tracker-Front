import { useState, useEffect } from "react";
import axios from "axios";
import { Analysis } from "./Analysis";
import "../scss/NewDashboard.scss";

export const NewDasboard = () => {
  const [weeklyExpenses, setWeeklyExpenses] = useState([]);
  const [monthlyBudgets, setMonthlyBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [tab, setTab] = useState("monthly");
  const [selectedExpenseOptions, setSelectedExpenseOptions] = useState(null);
  const [selectedIncomeOptions, setSelectedIncomeOptions] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;

  const fetchExpenses = async (filters) => {
    try {
      const response = await axios.get(`/api/expenses/getExpenses`, {
        params: { userId, ...filters },
      });
      console.log(response);
      setExpenses(response.data);
    } catch (error) {
      console.error(`Error fetching expenses`, error);
    }
  };

  const fetchIncomes = async (filters) => {
    try {
      const response = await axios.get("/api/incomes/getIncomes", {
        params: { userId, ...filters },
      });
      setIncomes(response.data);
    } catch {
      console.error(`Error fetching expenses`, error);
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  useEffect(() => {
    // Fetch expenses and budgets when the component mounts
    fetchWeeklyExpenses();
    fetchMonthlyBudgets();
    fetchExpenses();
    fetchIncomes();
  }, []);

  const fetchWeeklyExpenses = async () => {
    try {
      const response = await axios.get("/api/weeklyBudget/getWeeklyBudgets");
      setWeeklyExpenses(response.data);
    } catch (error) {
      console.error("Error fetching weekly expenses:", error);
    }
  };

  const fetchMonthlyBudgets = async () => {
    try {
      const response = await axios.get("/api/monthlyBudget/getMonthlyBudgets");
      setMonthlyBudgets(response.data);
    } catch (error) {
      console.error("Error fetching monthly budgets:", error);
    }
  };

  const handleTabChange = (selectedTab) => {
    setTab(selectedTab);
  };

  const handleExpenseSelect = (item) => {
    const currentDate = new Date();

    switch (item) {
      case "All":
        fetchExpenses();
        setSelectedExpenseOptions(item);
        break;
      case "Today":
        const filtersToday = {
          startDate: currentDate,
          endDate: new Date(currentDate.setUTCHours(23, 59, 59, 999)),
        };
        console.log(filtersToday);
        fetchExpenses(filtersToday);
        setSelectedExpenseOptions(item);
        break;

      case "ThisWeek":
        const startOfWeek = new Date(currentDate);
        startOfWeek.setUTCHours(0, 0, 0, 0);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setUTCHours(23, 59, 59, 999);

        const filtersThisWeek = {
          startDate: startOfWeek,
          endDate: endOfWeek,
        };
        console.log(filtersThisWeek);
        fetchExpenses(filtersThisWeek);
        setSelectedExpenseOptions(item);
        break;

      case "ThisMonth":
        const startOfMonth = new Date(currentDate);
        startOfMonth.setUTCHours(0, 0, 0, 0);
        startOfMonth.setDate(1);

        const endOfMonth = new Date(currentDate);
        endOfMonth.setUTCHours(23, 59, 59, 999);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);

        const filtersThisMonth = {
          startDate: startOfMonth,
          endDate: endOfMonth,
        };
        console.log(filtersThisMonth);
        fetchExpenses(filtersThisMonth);
        setSelectedExpenseOptions(item);
        break;

      case "ThisYear":
        const startOfYear = new Date(currentDate);
        startOfYear.setUTCHours(0, 0, 0, 0);
        startOfYear.setMonth(0, 1);

        const endOfYear = new Date(currentDate);
        endOfYear.setUTCHours(23, 59, 59, 999);
        endOfYear.setMonth(11, 31);

        const filtersThisYear = {
          startDate: startOfYear,
          endDate: endOfYear,
        };
        console.log(filtersThisYear);
        fetchExpenses(filtersThisYear);
        setSelectedExpenseOptions(item);
        break;

      default:
        console.log("Invalid option");
        break;
    }
  };
  const handleIncomeSelect = (item) => {
    const currentDate = new Date();

    switch (item) {
      case "All":
        fetchIncomes();
        setSelectedIncomeOptions(item);
        break;
      case "Today":
        const filtersToday = {
          startDate: currentDate,
          endDate: new Date(currentDate.setUTCHours(23, 59, 59, 999)),
        };
        console.log(filtersToday);
        fetchIncomes(filtersToday);
        setSelectedIncomeOptions(item);
        break;

      case "ThisWeek":
        const startOfWeek = new Date(currentDate);
        startOfWeek.setUTCHours(0, 0, 0, 0);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setUTCHours(23, 59, 59, 999);

        const filtersThisWeek = {
          startDate: startOfWeek,
          endDate: endOfWeek,
        };
        console.log(filtersThisWeek);
        fetchIncomes(filtersThisWeek);
        setSelectedIncomeOptions(item);
        break;

      case "ThisMonth":
        const startOfMonth = new Date(currentDate);
        startOfMonth.setUTCHours(0, 0, 0, 0);
        startOfMonth.setDate(1);

        const endOfMonth = new Date(currentDate);
        endOfMonth.setUTCHours(23, 59, 59, 999);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);

        const filtersThisMonth = {
          startDate: startOfMonth,
          endDate: endOfMonth,
        };
        console.log(filtersThisMonth);
        fetchIncomes(filtersThisMonth);
        setSelectedIncomeOptions(item);
        break;

      case "ThisYear":
        const startOfYear = new Date(currentDate);
        startOfYear.setUTCHours(0, 0, 0, 0);
        startOfYear.setMonth(0, 1);

        const endOfYear = new Date(currentDate);
        endOfYear.setUTCHours(23, 59, 59, 999);
        endOfYear.setMonth(11, 31);

        const filtersThisYear = {
          startDate: startOfYear,
          endDate: endOfYear,
        };
        console.log(filtersThisYear);
        fetchIncomes(filtersThisYear);
        setSelectedIncomeOptions(item);
        break;

      default:
        console.log("Invalid option");
        break;
    }
  };

  return (
    <div
      className="mx-auto"
      style={{ overflow: "auto", scrollbarWidth: "none", width: "80%" }}
    >
      <Analysis />

      {/* Budgets Section */}
      <div className="box-section">
        <h2 className="text-2xl font-semibold mb-4">Budgets</h2>
        <div className="flex space-x-4 justify-end mb-4">
          <button
            className={`py-2 px-4 rounded ${
              tab === "weekly"
                ? "bg-blue-500 text-white border-b-2 border-blue-500"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleTabChange("weekly")}
          >
            Weekly
          </button>
          <button
            className={`py-2 px-4 rounded ${
              tab === "monthly"
                ? "bg-blue-500 text-white border-b-2 border-blue-500"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleTabChange("monthly")}
          >
            Monthly
          </button>
        </div>
        <div className="box-content bg-gray-100 p-8 rounded-md mx-auto scrollable-card">
          <div className="flex flex-col space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tab === "weekly"
                ? weeklyExpenses.map((item, index) => (
                    <div
                      key={index}
                      className="mb-4 p-4 border border-gray-300 rounded"
                    >
                      <p className="text-sm font-semibold mb-2">
                        Month: {item.monthForWeek}, Year: {item.yearForWeek}
                      </p>
                      <p className="text-sm mb-2">
                        Start Date: {item.startDate.split("T")[0]}
                      </p>
                      <p className="text-sm mb-2">
                        End Date: {item.endDate.split("T")[0]}
                      </p>
                      <p className="text-sm mb-2">
                        Budget Amount: {item.budgetAmount}
                      </p>
                      {/* Render Expenses within the Weekly Budget Card */}
                      <div className="mt-2">
                        {item.expenses.map((expense, expenseIndex) => (
                          <div
                            key={expenseIndex}
                            className="mb-2 p-2 border border-gray-200 rounded"
                          >
                            <p className="text-xs font-semibold mb-1">
                              Description: {expense.description}
                            </p>
                            <p className="text-xs mb-1">
                              Amount: {expense.amount}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                : monthlyBudgets.map((budget, index) => (
                    <div
                      key={index}
                      className="mb-4 p-4 border border-gray-300 rounded"
                    >
                      <p className="text-sm font-semibold mb-2">
                        Month: {budget.month}, Year: {budget.year}
                      </p>
                      <p className="text-sm mb-2">
                        Budget Amount: {budget.budgetAmount}
                      </p>
                      <p className="text-sm mb-2">
                        Total Expenses: {budget.expenses.length}
                      </p>
                      {/* Render Expenses within the Monthly Budget Card */}
                      <div className="mt-2">
                        {budget.expenses.map((expense, expenseIndex) => (
                          <div
                            key={expenseIndex}
                            className="mb-2 p-2 border border-gray-200 rounded"
                          >
                            <p className="text-xs font-semibold mb-1">
                              Description: {expense.description}
                            </p>
                            <p className="text-xs mb-1">
                              Amount: {expense.amount}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="box-section">
        <h2 className="text-2xl font-semibold mb-4">Expenses</h2>
        <div className="flex space-x-4 justify-end mb-4">
          <button
            className={`py-2 px-4 rounded ${
              selectedExpenseOptions === "All"
                ? "bg-blue-500 text-white border-b-2 border-blue-500"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleExpenseSelect("All")}
          >
            All
          </button>
          <button
            className={`py-2 px-4 rounded ${
              selectedExpenseOptions === "Today"
                ? "bg-blue-500 text-white border-b-2 border-blue-500"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleExpenseSelect("Today")}
          >
            Today
          </button>
          <button
            className={`py-2 px-4 rounded ${
              selectedExpenseOptions === "ThisWeek"
                ? "bg-blue-500 text-white border-b-2 border-blue-500"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleExpenseSelect("ThisWeek")}
          >
            This Week
          </button>
          <button
            className={`py-2 px-4 rounded ${
              selectedExpenseOptions === "ThisMonth"
                ? "bg-blue-500 text-white border-b-2 border-blue-500"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleExpenseSelect("ThisMonth")}
          >
            This Month
          </button>
          <button
            className={`py-2 px-4 rounded ${
              selectedExpenseOptions === "ThisYear"
                ? "bg-blue-500 text-white border-b-2 border-blue-500"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleExpenseSelect("ThisYear")}
          >
            This Year
          </button>
        </div>
        <div className="box-content bg-gray-100 p-8 rounded-md mx-auto scrollable-card">
          <div className="flex flex-col space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <p className="text-sm">
                      Timestamp: {item.timestamp.split("T")[0]}
                    </p>
                    <p className="text-sm">
                      Status: {item.status ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Incomes Section */}
      <div className="box-section">
        <h2 className="text-2xl font-semibold mb-4">Incomes</h2>
        <div className="flex space-x-4 justify-end mb-4">
          <button
            className={`py-2 px-4 rounded ${
              selectedIncomeOptions === "All"
                ? "bg-blue-500 text-white border-b-2 border-blue-500"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleIncomeSelect("All")}
          >
            All
          </button>
          <button
            className={`py-2 px-4 rounded ${
              selectedIncomeOptions === "Today"
                ? "bg-blue-500 text-white border-b-2 border-blue-500"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleIncomeSelect("Today")}
          >
            Today
          </button>
          <button
            className={`py-2 px-4 rounded ${
              selectedIncomeOptions === "ThisWeek"
                ? "bg-blue-500 text-white border-b-2 border-blue-500"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleIncomeSelect("ThisWeek")}
          >
            This Week
          </button>
          <button
            className={`py-2 px-4 rounded ${
              selectedIncomeOptions === "ThisMonth"
                ? "bg-blue-500 text-white border-b-2 border-blue-500"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleIncomeSelect("ThisMonth")}
          >
            This Month
          </button>
          <button
            className={`py-2 px-4 rounded ${
              selectedIncomeOptions === "ThisYear"
                ? "bg-blue-500 text-white border-b-2 border-blue-500"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleIncomeSelect("ThisYear")}
          >
            This Year
          </button>
        </div>
        <div className="box-content bg-gray-100 p-8 rounded-md mx-auto scrollable-card">
          <div className="flex flex-col space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
