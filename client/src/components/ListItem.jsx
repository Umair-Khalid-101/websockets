import React from "react";
import { HiDotsHorizontal } from "react-icons/hi";

const ListItem = ({ data, handleChat }) => {
  return (
    <div
      className="cursor-pointer
    hover:bg-blue-500 duration-75
    py-1 rounded-[8px]
    "
      onClick={handleChat}
    >
      <div
        className="relative flex items-cente 
      px-6 py-1 hover:bg-layer-3 focus:z-20 focus:outline-none 
      focus:ring-2 focus:ring-heading/80 gap-4"
      >
        <img src={data?.pic} alt="userpic" className="w-8 h-8 rounded-full" />
        <div className="flex flex-col justify-center items-start">
          <p className="text-[14px] font-semibold">{data?.name}</p>
          <p className="text-[14px] font-semibold">{data?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
