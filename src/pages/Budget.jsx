import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export const Budget = () => {
  const [tab, setTab] = useState("weekly");
  const [startDateForWeek, setStartDateForWeek] = useState(new Date());
  const [weeklyValues, setWeeklyValues] = useState({
    startDate: "",
    endDate: "",
    budgetAmount: "",
    expenses: [{ description: "", amount: "" }],
  });
  const [monthlyValues, setMonthlyValues] = useState({
    month: "",
    year: "",
    budgetAmount: "",
    expenses: [{ description: "", amount: "" }],
  });
  const [weeklyExpenses, setWeeklyExpenses] = useState([]);
  const [monthlyBudgets, setMonthlyBudgets] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;

  useEffect(() => {
    fetchWeeklyExpenses();
    fetchMonthlyBudgets();
  }, []);

  const fetchWeeklyExpenses = async () => {
    try {
      const response = await axios.get("/api/weeklyBudget/getWeeklyBudgets", {
        params: { userId },
      });
      setWeeklyExpenses(response.data);
    } catch (error) {
      console.error("Error fetching weekly expenses:", error);
    }
  };

  const fetchMonthlyBudgets = async () => {
    try {
      const response = await axios.get("/api/monthlyBudget/getMonthlyBudgets", {
        params: { userId },
      });
      setMonthlyBudgets(response.data);
    } catch (error) {
      console.error("Error fetching monthly budgets:", error);
    }
  };

  const handleTabChange = (selectedTab) => {
    setTab(selectedTab);
  };
  const handleWeekInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Week Input - name:", name, "value:", value);

    if (name === "startDateForWeek") {
      handleWeekDateChange(value);
    } else {
      setWeeklyValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const handleMonthInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Month Input - name:", name, "value:", value);

    setMonthlyValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleWeekDateChange = (date) => {
    console.log("Week Date ----", date);
    setStartDateForWeek(date);
  };

  const handleAddWeeklyExpense = () => {
    setWeeklyValues((prevValues) => {
      return {
        ...prevValues,
        expenses: [...prevValues.expenses, { description: "", amount: "" }],
      };
    });
  };

  const handleAddMonthlyExpense = () => {
    setMonthlyValues((prevValues) => {
      return {
        ...prevValues,
        expenses: [...prevValues.expenses, { description: "", amount: "" }],
      };
    });
  };

  const handleWeeklySubmit = async () => {
    try {
      console.log(weeklyValues);
      console.log(startDateForWeek);
      const startDate = startDateForWeek;
      const endDate = new Date(startDateForWeek);
      endDate.setDate(endDate.getDate() + 6);
      const monthForWeek = startDateForWeek
        ? startDateForWeek.toLocaleString("default", { month: "long" })
        : "";
      const yearForWeek = startDateForWeek
        ? startDateForWeek.getFullYear()
        : "";

      console.log(
        "start Date: ",
        startDate + "," + "end Date: ",
        endDate + "," + "month: ",
        monthForWeek + "," + "year: ",
        yearForWeek
      );

      const newBudget = {
        userId,
        startDate,
        endDate,
        budgetAmount: weeklyValues.budgetAmount,
        expenses: weeklyValues.expenses,
        monthForWeek,
        yearForWeek,
      };

      await axios.post("/api/weeklyBudget/addWeeklyBudget", newBudget);

      setWeeklyValues((prevValues) => ({
        ...prevValues,
        startDate: "",
        budgetAmount: "",
        expenses: [{ description: "", amount: "" }],
      }));

      fetchWeeklyExpenses();
    } catch (error) {
      console.error("Error submitting weekly budget:", error);
    }
  };

  const handleMonthlySubmit = async () => {
    try {
      const newBudget = {
        userId,
        month: monthlyValues.month,
        year: monthlyValues.year,
        budgetAmount: monthlyValues.budgetAmount,
        expenses: monthlyValues.expenses,
      };

      await axios.post("/api/monthlyBudget/addMonthlyBudget", newBudget);

      setMonthlyValues({
        month: "",
        year: "",
        budgetAmount: "",
        expenses: [{ description: "", amount: "" }],
      });

      fetchMonthlyBudgets();
    } catch (error) {
      console.error("Error submitting monthly budget:", error);
    }
  };

  const handleWeekExpenseInputChange = (index, e) => {
    const { name, value } = e.target;
    setWeeklyValues((prevValues) => {
      const updatedExpenses = [...prevValues.expenses];
      updatedExpenses[index][name] = value;
      return { ...prevValues, expenses: updatedExpenses };
    });
  };

  const handleMonthExpenseInputChange = (index, e) => {
    const { name, value } = e.target;
    setMonthlyValues((prevValues) => {
      const updatedExpenses = [...prevValues.expenses];
      updatedExpenses[index][name] = value;
      return { ...prevValues, expenses: updatedExpenses };
    });
  };
  const handleSubmit = () => {
    tab === "weekly" ? handleWeeklySubmit() : handleMonthlySubmit();
  };

  return (
    <div className="flex-1 bg-gray-200 p-8 overflow-y-auto">
      <div className="bg-white p-6 rounded-md shadow-md mb-4">
        <div className="flex space-x-4 mb-4">
          <button
            className={`py-2 px-4 ${
              tab === "weekly"
                ? "bg-blue-500 text-white border-b-2 border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => handleTabChange("weekly")}
          >
            Weekly
          </button>
          <button
            className={`py-2 px-4 ${
              tab === "monthly"
                ? "bg-blue-500 text-white border-b-2 border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => handleTabChange("monthly")}
          >
            Monthly
          </button>
        </div>
        <div className="mt-4">
          {tab === "weekly" && (
            <>
              <DatePicker
                selected={startDateForWeek}
                onChange={(date) => setStartDateForWeek(date)}
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="number"
                name="budgetAmount"
                placeholder="Budget Amount"
                value={weeklyValues.budgetAmount}
                onChange={handleWeekInputChange}
                className="border border-gray-300 p-2 mb-2 w-full"
              />

              {weeklyValues.expenses.map((expense, index) => (
                <div key={index} className="flex space-x-4 mb-2">
                  <input
                    type="text"
                    name="description"
                    placeholder="Expense Description"
                    value={expense.description}
                    onChange={(e) => handleWeekExpenseInputChange(index, e)}
                    className="border border-gray-300 p-2 w-full"
                  />
                  <input
                    type="number"
                    name="amount"
                    placeholder="Expense Amount"
                    value={expense.amount}
                    onChange={(e) => handleWeekExpenseInputChange(index, e)}
                    className="border border-gray-300 p-2 w-full"
                  />
                </div>
              ))}
              <button
                onClick={handleAddWeeklyExpense}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
              >
                Add Expense
              </button>
            </>
          )}
          {tab === "monthly" && (
            <>
              <input
                type="text"
                name="month"
                placeholder="Month"
                value={monthlyValues.month}
                onChange={handleMonthInputChange}
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="number"
                name="year"
                placeholder="Year"
                value={monthlyValues.year}
                onChange={handleMonthInputChange}
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="number"
                name="budgetAmount"
                placeholder="Budget Amount"
                value={monthlyValues.budgetAmount}
                onChange={handleMonthInputChange}
                className="border border-gray-300 p-2 mb-2 w-full"
              />

              {monthlyValues.expenses.map((expense, index) => (
                <div key={index} className="flex space-x-4 mb-2">
                  <input
                    type="text"
                    name="description"
                    placeholder="Expense Description"
                    value={expense.description}
                    onChange={(e) => handleMonthExpenseInputChange(index, e)}
                    className="border border-gray-300 p-2 w-full"
                  />
                  <input
                    type="number"
                    name="amount"
                    placeholder="Expense Amount"
                    value={expense.amount}
                    onChange={(e) => handleMonthExpenseInputChange(index, e)}
                    className="border border-gray-300 p-2 w-full"
                  />
                </div>
              ))}
              <button
                onClick={handleAddMonthlyExpense}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
              >
                Add Expense
              </button>
            </>
          )}

          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="flex space-x-4 mt-4">
        <div className="flex-1 bg-white p-4 rounded-md shadow-md scrollable-card">
          <h2 className="text-lg font-semibold mb-2 sticky-heading">
            {tab === "weekly" ? "Weekly Expenses" : "Monthly Expenses"}
          </h2>
          {tab === "weekly"
            ? weeklyExpenses.map((item, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border border-gray-300 rounded"
                >
                  <p className="text-sm font-semibold mb-2">
                    Month: {item.monthForWeek}
                  </p>
                  <p className="text-sm font-semibold mb-2">
                    Year: {item.yearForWeek}
                  </p>
                  <p className="text-sm  mb-2">
                    Start Date: {item.startDate.split("T")[0]}
                  </p>
                  <p className="text-sm mb-2">
                    End Date: {item.endDate.split("T")[0]}
                  </p>
                  <p className="text-sm mb-2">
                    Budget Amount: {item.budgetAmount}
                  </p>

                  <div className="mt-2">
                    {item.expenses.map((expense, expenseIndex) => (
                      <div
                        key={expenseIndex}
                        className="mb-2 p-2 border border-gray-200 rounded"
                      >
                        <p className="text-xs font-semibold mb-1">
                          Description: {expense.description}
                        </p>
                        <p className="text-xs mb-1">Amount: {expense.amount}</p>
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

                  <div className="mt-2">
                    {budget.expenses.map((expense, expenseIndex) => (
                      <div
                        key={expenseIndex}
                        className="mb-2 p-2 border border-gray-200 rounded"
                      >
                        <p className="text-xs font-semibold mb-1">
                          Description: {expense.description}
                        </p>
                        <p className="text-xs mb-1">Amount: {expense.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};
