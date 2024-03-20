// GroupExpenses.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const GroupExpenses = ({ groupCode, socket }) => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState("");

  useEffect(() => {
    socket.on("expenseAdded", (data) => {
      console.log("Expense added:", data);
      setExpenses((prevExpenses) => [...prevExpenses, data]);
    });

    return () => {
      socket.off("expenseAdded");
    };
  }, [socket]);

  const handleAddExpense = async () => {
    try {
      const response = await axios.post(`/api/groups/${groupCode}/addExpense`, {
        expense: newExpense,
      });

      if (response.status === 200) {
        const data = response.data;
        console.log("Expense added:", data);
        socket.emit("expenseAdded", data);
        setNewExpense("");
      } else {
        console.error("Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div>
      <h2>Group Expenses ({groupCode})</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense._id}>{expense.name}</li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newExpense}
          onChange={(e) => setNewExpense(e.target.value)}
        />

        <button onClick={handleAddExpense}>Add Expense</button>
      </div>
    </div>
  );
};

export default GroupExpenses;
