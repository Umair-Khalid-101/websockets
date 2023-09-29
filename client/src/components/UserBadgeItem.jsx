import React from "react";
import { GrFormClose } from "react-icons/gr";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <div
      className="flex justify-center items-center px-4
  bg-blue-500 relative py-2 gap-4 rounded-[8px]"
    >
      <p className="text-white text-[14px]">{user?.name}</p>
      <GrFormClose
        className="text-white h-6 w-6 cursor-pointer"
        onClick={handleFunction}
      />
    </div>
  );
};

export default UserBadgeItem;
