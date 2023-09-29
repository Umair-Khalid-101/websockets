import React, { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Vortex } from "react-loader-spinner";

// CONTEXT
import { useStateContext } from "../context";

// SPLIT IMPORTS
// const SearchUser = lazy(() => import("../components/SearchUser"));
const Navbar = lazy(() => import("../components/Navbar"));
const Drawer = lazy(() => import("../components/Drawer"));
const Card = lazy(() => import("../components/Card"));
const SearchInput = lazy(() => import("../components/SearchInput"));
const ListItem = lazy(() => import("../components/ListItem"));
const MyChats = lazy(() => import("../components/MyChats"));
const ChatBox = lazy(() => import("../components/ChatBox"));

// CONSTANT
import { apiUrl } from "../constants";

const ChatPage = () => {
  const {
    searching,
    searchResults,
    loadingChat,
    setLoadingChat,
    user,
    selectedChat,
    setSelectedChat,
    myChats,
    setMyChats,
    setIsOpen,
  } = useStateContext();

  const array = [1, 2, 3, 4];

  // ACCESS CHAT
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.post(
        `${apiUrl}/api/chat`,
        { userId },
        config
      );

      if (!myChats.find((chat) => chat._id === data._id)) {
        setMyChats([data, ...myChats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      setIsOpen(false);
    } catch (error) {
      toast.error("Error fetching chat!", {
        position: "top-right",
      });
      setLoadingChat(false);
      return;
    }
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
        <Drawer>
          <div className="flex justify-center items-center">
            <SearchInput />
          </div>
          {searching ? (
            <>
              {array?.map((item) => (
                <Card key={item} />
              ))}
            </>
          ) : (
            <>
              {searchResults &&
                searchResults.length > 0 &&
                searchResults?.map((item) => (
                  <Suspense key={item?._id} fallback={<div>Loading...</div>}>
                    <>
                      <ListItem
                        key={item?._id}
                        data={item}
                        handleChat={() => accessChat(item?._id)}
                      />
                    </>
                  </Suspense>
                ))}
            </>
          )}
          <div className="flex justify-center items-center">
            {loadingChat && (
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
            )}
          </div>
        </Drawer>
        <div className="flex gap-4 h-[89]">
          <div
            className="w-[25%] border border-gray-100 rounded-[8px]
          shadow-md h-[89]
          "
          >
            <MyChats />
          </div>
          <div
            className="w-[75%] border border-gray-100 rounded-[8px]
          shadow-md h-[89vh]"
          >
            <ChatBox />
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default ChatPage;
