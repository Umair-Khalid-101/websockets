import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chatLogics";

// CONTEXT
import { useStateContext } from "../context";

function ScrollableChat({ messages }) {
  const { user } = useStateContext();
  console.log(
    "\nSCROLLABLE CHAT: \n\x1b[32m%s\x1b[0m\n",
    JSON.stringify(messages, null, 2)
  );
  return (
    <div className="p-4 min-h-screen overflow-y-scroll">
      {messages &&
        messages.map((message, index) => (
          <div className="flex" key={message._id}>
            {(isSameSender(messages, message, index, user._id) ||
              isLastMessage(messages, index, user._id)) && (
              <img
                src={message.sender.pic}
                alt={message.sender.name}
                className="h-8 w-8 rounded-full"
              />
            )}
            <span
              style={{
                backgroundColor: `${
                  message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(
                  messages,
                  message,
                  index,
                  user._id
                ),
                marginTop: isSameUser(messages, message, index, user._id)
                  ? 3
                  : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
    </div>
  );
}

export default ScrollableChat;
