import React from "react";
import { GrFormClose } from "react-icons/gr";

// CONTEXT
import { useStateContext } from "../context";

const GroupChatModal = ({ onClose, children }) => {
  const { groupModelOpen } = useStateContext();

  if (!groupModelOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div
        className="relative z-10 bg-white p-6 rounded-lg shadow-lg
      w-[600px] h-[550px]
      "
      >
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <button
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
            onClick={onClose}
          >
            <GrFormClose className="text-gray-800 h-6 w-6 cursor-pointer" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default GroupChatModal;