import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Toggle from "react-toggle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Modal = ({ isOpen, onClose, onSubmit, itemData, isIncome }) => {
  const [editedData, setEditedData] = useState({
    description: "",
    amount: 0,
    status: false,
    date: new Date(),
  });

  useEffect(() => {
    if (itemData) {
      setEditedData({
        description: itemData.description || "",
        amount: itemData.amount || 0,
        status: itemData.status || false,
        date: itemData.date ? new Date(itemData.date) : new Date(),
      });
    } else {
      setEditedData({
        description: "",
        amount: 0,
        status: false,
        date: new Date(),
      });
    }
  }, [itemData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStatusChange = () => {
    setEditedData((prevData) => ({
      ...prevData,
      status: !prevData.status,
    }));
  };

  const handleDateChange = (date) => {
    setEditedData((prevData) => ({
      ...prevData,
      date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(editedData, isIncome);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-md shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">
          {isIncome ? "Edit Income" : "Edit Expense"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="flex flex-col">
            <span className="text-sm mb-1">Description:</span>
            <input
              type="text"
              name="description"
              value={editedData.description}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm mb-1">Amount:</span>
            <input
              type="number"
              name="amount"
              value={editedData.amount}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md"
            />
          </label>
          <label className="flex items-center">
            <span className="text-sm mb-1 mr-2">Status:</span>
            <Toggle checked={editedData.status} onChange={handleStatusChange} />
          </label>
          <label className="flex flex-col">
            <span className="text-sm mb-1">Date:</span>
            <DatePicker
              selected={editedData.date}
              onChange={handleDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="border border-gray-300 p-2 rounded-md"
            />
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-all duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  itemData: PropTypes.object,
  isIncome: PropTypes.bool,
};

export default Modal;
