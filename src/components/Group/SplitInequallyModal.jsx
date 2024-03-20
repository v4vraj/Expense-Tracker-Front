import React, { useState } from "react";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";
import "../../scss/SplitInequallyModal.scss";

const SplitInequallyModal = ({
  isOpen,
  closeModal,
  groupUsers,
  handleInequallySplit,
}) => {
  const [userPercentages, setUserPercentages] = useState({});
  const [totalPercentage, setTotalPercentage] = useState(100);

  const handlePercentageChange = (userId, percentage) => {
    setUserPercentages((prevPercentages) => ({
      ...prevPercentages,
      [userId]: percentage,
    }));
  };

  const handleInequallySplitSubmit = (e) => {
    e.preventDefault();
    handleInequallySplit(userPercentages);
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Select Users for Inequally Split"
      className="modal"
      overlayClassName="modal-overlay"
      appElement={document.getElementById("root")}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="text-2xl mb-4">Adjust Split</h2>

          <AiOutlineClose onClick={closeModal} />
        </div>
        <form onSubmit={handleInequallySplitSubmit}>
          {groupUsers.map((user) => (
            <div key={user.userId} className="mb-2">
              <label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder={`Percentage for ${user.email}`}
                  value={userPercentages[user.userId] || ""}
                  onChange={(e) =>
                    handlePercentageChange(user.userId, e.target.value)
                  }
                />
                {user.email}
              </label>
            </div>
          ))}
          <p>Total Percentage: {totalPercentage}</p>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Split Inequally
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default SplitInequallyModal;
