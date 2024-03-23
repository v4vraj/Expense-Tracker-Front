import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateModal = ({ isOpen, onClose, onSubmit, expenseTitle, userEmail }) => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/expenses/setReminder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: expenseTitle,
            email: userEmail,
            reminderDate: selectedDate.toISOString(),
          }),
        }
      );

      if (response.ok) {
        console.log("Reminder set successfully!");
        onSubmit();
      } else {
        console.error("Failed to set reminder");
      }
    } catch (error) {
      console.error("Error setting reminder:", error);
    }

    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div
      className={`${
        isOpen ? "flex" : "hidden"
      } fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 justify-center items-center`}
    >
      <div className="bg-white p-8 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">Set Reminder</h2>
        <div className="mb-6">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
          >
            Set Reminder
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateModal;
