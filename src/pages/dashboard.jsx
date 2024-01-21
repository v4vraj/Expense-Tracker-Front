import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { ExpenseForm } from "../components/Dashboard/ExpenseForm";
import { IncomeForm } from "../components/Dashboard/IncomeForm";

export const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const addIncome = (income) => {
    setIncomes([...incomes, income]);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-200 p-8">
        <h1 className="text-2xl font-bold mb-4">Main Content</h1>

        {/* Display Expenses */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Expenses</h2>
          <ul>
            {expenses.map((expense, index) => (
              <li key={index}>{expense}</li>
            ))}
          </ul>
        </div>

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
