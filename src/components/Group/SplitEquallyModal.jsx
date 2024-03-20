import React, { useState } from "react";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";
import "../../scss/SplitEquallyModal.scss";

const SplitEquallyModal = ({
  isOpen,
  closeModal,
  groupUsers,
  handleEquallySplit,
}) => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevUsers) => {
      if (prevUsers.includes(userId)) {
        return prevUsers.filter((id) => id !== userId);
      } else {
        return [...prevUsers, userId];
      }
    });
  };

  const handleSplitEquallySubmit = (e) => {
    e.preventDefault();
    handleEquallySplit(selectedUsers);
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Select Users for Equally Split"
      className="modal"
      overlayClassName="modal-overlay"
      appElement={document.getElementById("root")}
    >
      <div className="modal-content">
        <div className="modal-header ">
          <h2 className="text-2xl mb-4">Adjust Split</h2>
          <AiOutlineClose onClick={closeModal} />
        </div>
        <form onSubmit={handleSplitEquallySubmit}>
          {groupUsers.map((user) => (
            <div key={user.userId} className="mb-2">
              <label>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.userId)}
                  onChange={() => handleCheckboxChange(user.userId)}
                />
                {user.email}
              </label>
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Split Equally
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default SplitEquallyModal;
