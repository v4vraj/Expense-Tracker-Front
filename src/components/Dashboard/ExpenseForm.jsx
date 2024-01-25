import axios from "axios";
import { useState } from "react";

export const ExpenseForm = ({ addExpense }) => {
  const [expenseData, setExpenseData] = useState({
    description: "",
    amount: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a request to your backend to add the expense
      const response = await axios.post(
        "http://localhost:3000/api/expenses/addExpense",
        {
          description: expenseData.description,
          amount: expenseData.amount,
        }
      );

      // Update the local state or perform any additional logic if needed
      addExpense(response.data); // Assuming the response contains the added expense data
      setExpenseData({
        description: "",
        amount: 0,
      });
    } catch (error) {
      console.error("Error adding expense", error);
      // Handle error
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={expenseData.description}
            onChange={(e) =>
              setExpenseData({ ...expenseData, description: e.target.value })
            }
          />
        </label>
        <label>
          Amount:
          <input
            type="number"
            name="amount"
            value={expenseData.amount}
            onChange={(e) =>
              setExpenseData({ ...expenseData, amount: e.target.value })
            }
          />
        </label>
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};
