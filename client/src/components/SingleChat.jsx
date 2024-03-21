import React, { useState, useEffect } from "react";
import { Vortex } from "react-loader-spinner";
import { toast } from "react-toastify";
import axios from "axios";

// COTEXT
import { useStateContext } from "../context";

// CONSTANTS
import { apiUrl } from "../constants";

// COMPONENT
import ScrollableChat from "./ScrollableChat";

const SingleChat = () => {
  const { user, selectedChat, fetchAgain } = useStateContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const typingHandler = async (e) => {
    console.log("Typing: ", e.target.value);
    setNewMessage(e.target.value);

    // todo typing indicator logic
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      console.log("Sending Message: ", newMessage);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        clearInput();
        const { data } = await axios.post(
          `${apiUrl}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat?._id,
          },
          config
        );
        console.log(
          "\nDATA: \n\x1b[32m%s\x1b[0m\n",
          JSON.stringify(data, null, 2)
        );
        setMessages([...messages, data]);
      } catch (error) {
        toast.error("Failed to send message", {
          position: "top-right",
        });
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat, fetchAgain]);

  const clearInput = () => {
    console.log("Clearing input");
    setNewMessage("");
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `${apiUrl}/api/message/${selectedChat._id}`,
        config
      );
      console.log(
        "\nMESSAGES: \n\x1b[32m%s\x1b[0m\n",
        JSON.stringify(data, null, 2)
      );
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.log(
        "\nError-(fetchMessages): \n\x1b[32m%s\x1b[0m\n",
        JSON.stringify(error, null, 2)
      );
      toast.error("Failed to fetch messages", {
        position: "top-right",
      });
      setLoading(false);
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          {/* MESSAGES BOX */}
          <div
            className="
          h-[33vw] overflow-y-scroll
          scrollbar-hide
          "
          >
            {loading ? (
              <>
                <div className="flex justify-center items-center h-full">
                  <Vortex
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="vortex-loading"
                    wrapperStyle={{}}
                    wrapperClass="vortex-wrapper"
                    colors={[
                      "blue",
                      "blue",
                      "blue",
                      "blue",
                      "blue",
                      "blue",
                      "blue",
                    ]}
                  />
                </div>
              </>
            ) : (
              <>
                {/* MESSAGES */}
                <div className="">
                  <ScrollableChat messages={messages} />
                </div>
                {/* MESSAGES */}
              </>
            )}
          </div>
          {/* MESSAGES BOX */}

          {/* MESSAGE INPUT */}
          <div className="w-full">
            <input
              type="text"
              className="pl-2 pr-8 rounded-[8px] text-sm focus:outline-none 
              focus:bg-white focus:text-gray-900
              border border-gray-200 w-[100%] bg-gray-200 h-[4vw]"
              placeholder="Type your message"
              onChange={(e) => typingHandler(e)}
              onKeyDown={(e) => sendMessage(e)}
              autoComplete="false"
              value={newMessage}
            />
          </div>
          {/* MESSAGE INPUT */}
        </>
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
    </>
  );
};

export default SingleChat;
