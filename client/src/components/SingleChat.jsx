import React from "react";

// COTEXT
import { useStateContext } from "../context";

const SingleChat = () => {
  const { user, selectedChat, setSelectedChat } = useStateContext();
  return (
    <>
      {selectedChat ? (
        <></>
      ) : (
        <>
          <div
            className="flex justify-center items-center
          w-full h-full
          "
          >
            <p className="font-semibold text-[20px]">
              Click on a User to Start Chatting!
            </p>
          </div>
        </>
      )}

      {/* MESSAGES BOX */}
      <div>Messages Box</div>
      {/* MESSAGES BOX */}
    </>
  );
};

export default SingleChat;
