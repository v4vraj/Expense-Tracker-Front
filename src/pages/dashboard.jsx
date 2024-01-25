import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { ExpenseForm } from "../components/Dashboard/ExpenseForm";
import { IncomeForm } from "../components/Dashboard/IncomeForm";

export const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  const addExpense = async (newExpense) => {
    try {
      // Send a request to your backend to add the expense
      await axios.post(
        "http://localhost:3000/api/expenses/addExpense",
        newExpense
      );

      // Fetch the updated list of expenses
      const response = await axios.get(
        "http://localhost:3000/api/expenses/getExpenses"
      );
      setExpenses(response.data);
    } catch (error) {
      console.error("Error adding expense", error);
      // Handle error
    }
  };

  const addIncome = (income) => {
    setIncomes([...incomes, income]);
  };

  useEffect(() => {
    // Fetch expenses when the component mounts
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/expenses/getExpenses"
        );
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching expenses", error);
        // Handle error
      }
    };

    fetchExpenses();
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-200 p-8">
        <h1 className="text-2xl font-bold mb-4">Main Content</h1>

        {/* Display Expenses */}
        {expenses.map((expense, index) => (
          <div key={index}>
            <p>Description: {expense.description}</p>
            <p>Amount: {expense.amount}</p>
          </div>
        ))}
        {/* ... */}

        {/* Display Incomes */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Incomes</h2>
          <ul>
            {incomes.map((income, index) => (
              <li key={index}>{income}</li>
            ))}
          </ul>
        </div>

        <ExpenseForm addExpense={addExpense} />
        <IncomeForm addIncome={addIncome} />
      </div>

      <div className="w-80 bg-white p-8">
        <h2 className="text-lg font-semibold mb-4">To-Do List</h2>
      </div>
    </div>
  );
};
