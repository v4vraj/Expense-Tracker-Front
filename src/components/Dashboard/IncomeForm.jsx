import { useState } from "react";

export const IncomeForm = ({ addExpense }) => {
  const [income, setIncome] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addExpense(income);
    setIncome("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          {" "}
          Add Income
          <input
            type="text"
            name="income"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </label>
        <button type="submit">Add Income</button>
      </form>
    </div>
  );
};
