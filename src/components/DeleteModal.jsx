import PropTypes from "prop-types";

const DeleteModal = ({ isOpen, onClose, onSubmit, title, isIncome }) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    // Add any additional logic before deleting, if needed
    console.log("Before onSubmit:", isIncome);
    onSubmit(isIncome);
    onClose();
    console.log("After onSubmit:", isIncome);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <div className="mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this item?
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-4 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
  isIncome: PropTypes.bool,
};

export default DeleteModal;
