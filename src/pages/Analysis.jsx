import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3000/api";
const EXPENSES_ENDPOINT = "/expenses";

export const Analysis = () => {
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState(false);
  const userId = localStorage.getItem("UserId");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}${EXPENSES_ENDPOINT}/getExpenses`,
          {
            params: {
              userId,
              page: currentPage,
              itemsPerPage,
              sortOrder,
              status: filterStatus,
            },
          }
        );

        setExpenses(response.data.expenses);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching expenses", error);
      }
    };

    fetchExpenses();
  }, [userId, currentPage, itemsPerPage, sortOrder, filterStatus]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleSortChange = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  const handleFilterChange = (value) => {
    if (value === "active") {
      setFilterStatus(true);
      console.log(filterStatus);
    } else if (value === "inactive") {
      setFilterStatus(false);
      console.log(filterStatus);
    } else if (value === "ALL") {
      setFilterStatus();
    } else {
      setFilterStatus();
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label className="mr-2">Sort Order:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="mr-2">Filter Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="ALL">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {expenses.map((expense, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {expense.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{expense.amount}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {expense.status ? "Active" : "Inactive"}
                </div>
              </td>
              {/* Add more columns as needed */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mr-2 text-sm font-medium text-gray-500 cursor-pointer"
        >
          Previous
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-2 text-sm font-medium text-gray-500 cursor-pointer ${
              currentPage === index + 1 ? "bg-gray-200" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-500 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};
