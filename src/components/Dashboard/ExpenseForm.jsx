import { useState } from "react";

export const ExpenseForm = ({ addExpense }) => {
  const [expense, setExpense] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Corrected typo here
    addExpense(expense);
    setExpense("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Expense:
          <input
            type="text"
            name="expense"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
          />
        </label>
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};
