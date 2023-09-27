import React, { useEffect, Suspense, lazy, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { Vortex } from "react-loader-spinner";

// CONTEXT
import { useStateContext } from "../context";

// CONSTANTS
import { apiUrl } from "../constants";
import { getSender } from "../config/chatLogics";

// COMPONENTS
const GroupChatModal = lazy(() => import("./GroupChatModal"));
const ListItem = lazy(() => import("./ListItem"));
import UserBadgeItem from "./UserBadgeItem";

const MyChats = () => {
  const {
    myChats,
    setMyChats,
    selectedChat,
    setSelectedChat,
    user,
    groupModelOpen,
    setGroupModelOpen,
  } = useStateContext();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryResults, setSearchQueryResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.get(`${apiUrl}/api/chat`, config);
      // console.log("Chats: ", data);
      setSelectedChat(data[0]);
      setMyChats(data);
    } catch (error) {
      toast.error("Failed to load chats!", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const openModal = () => {
    setGroupModelOpen(true);
  };

  const closeModal = () => {
    setGroupModelOpen(false);
    setSearchQuery("");
    setSearchQueryResults([]);
    setSelectedUsers([]);
  };

  // HANDLE SEARCH
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // if (!searchQuery) {
    //   return;
    // }

    // try {
    //   setLoading(true);
    //   console.log("Search Query: ", searchQuery);
    //   const config = {
    //     headers: {
    //       Authorization: `Bearer ${user?.token}`,
    //     },
    //   };

    //   const { data } = await axios.get(
    //     `${apiUrl}/api/user/allusers?search=${searchQuery}`,
    //     config
    //   );

    //   console.log("Searched Users: ", data);
    //   setSearchQueryResults(data);
    //   setLoading(false);
    // } catch (error) {
    //   toast.error("Failed to Load Search Results!", {
    //     position: "top-right",
    //   });
    // }
  };

  // CREATE GROUP CHAT
  const handleCreateChat = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.error("Please Fill all of the fields", {
        position: "top-right",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.post(
        `${apiUrl}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );
      setMyChats([data, ...myChats]);
      setSelectedChat(data);
      closeModal();
      toast.success("New Group Chat Created: " + groupChatName, {
        position: "top-right",
      });
    } catch (error) {
      toast.error("Error creating group chat", {
        position: "top-right",
      });
    }
  };

  // HANDLE GROUP
  const handleGroup = (userToAdd) => {
    // console.log("User to add: ", userToAdd);
    if (selectedUsers.includes(userToAdd)) {
      toast.info("User already added!", {
        position: "top-right",
      });
      return;
    }

    setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, userToAdd]);
  };

  // HANDLE DELETE FROM SELECTED USERS
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== delUser._id));
  };

  // USEEFFECT FOR IMMEDIATE STATE UPDATE
  useEffect(() => {
    const getSearchedUsers = async () => {
      if (!searchQuery) {
        return;
      }

      try {
        setLoading(true);
        // console.log("Search Query: ", searchQuery);
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };

        const { data } = await axios.get(
          `${apiUrl}/api/user/allusers?search=${searchQuery}`,
          config
        );

        // console.log("Searched Users: ", data);
        setSearchQueryResults(data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to Load Search Results!", {
          position: "top-right",
        });
      }
    };
    getSearchedUsers();
  }, [searchQuery]);

  useEffect(() => {
    // console.log("Selected users:", selectedUsers);
  }, [selectedUsers]);

  return (
    <div
      className="flex justify-center items-center flex-col
    "
    >
      <div
        className="flex justify-around items-center
      mt-4 gap-12
      "
      >
        <h1 className="font-semibold ">My Chats</h1>
        <button
          className="bg-blue-400
        text-white px-3 py-2 rounded-[8px]
        hover:bg-blue-600 duration-75
        text-[12px] font-semibold
        flex justify-center items-center gap-2
        "
          onClick={openModal}
        >
          New Group Chat
          <AiOutlineUsergroupAdd className="w-6 h-6 text-white" />
        </button>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <GroupChatModal onClose={closeModal}>
          {/* Content inside the modal */}
          <h1
            className="text-[24px] font-semibold mb-2
          flex justify-center items-center
          "
          >
            Create Group Chat
          </h1>
          <div
            className="flex justify-center items-center flex-col gap-4
          mt-8
          "
          >
            <input
              type="text"
              className="py-2 pl-2 pr-8 rounded-[8px] text-sm focus:outline-none 
              focus:bg-white focus:text-gray-900
              border border-gray-200 w-[80%]"
              placeholder="Group Chat Name"
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <input
              type="text"
              className="py-2 pl-2 pr-8 rounded-[8px] text-sm focus:outline-none 
              focus:bg-white focus:text-gray-900
              border border-gray-200 w-[80%]"
              placeholder="Search Users to Add, At least 3 characters"
              onChange={(e) => handleSearch(e)}
            />
          </div>

          <div className="my-2 flex justify-start items-center gap-4">
            {selectedUsers.map((user) => (
              <UserBadgeItem
                user={user}
                key={user._id}
                handleFunction={() => handleDelete(user)}
              />
            ))}
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center">
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
            ) : (
              searchQueryResults.length > 0 &&
              searchQueryResults?.slice(0, 4).map((user) => (
                <Suspense key={user?._id} fallback={<div>Loading...</div>}>
                  <ListItem data={user} handleChat={() => handleGroup(user)} />
                </Suspense>
              ))
            )}
          </div>

          <div className="flex justify-center items-center mt-4">
            <button
              className="bg-blue-400
            text-white px-6 py-2 rounded-[8px]
            hover:bg-blue-600 duration-75
            text-[14px] font-semibold
            flex justify-center items-center gap-2"
              onClick={handleCreateChat}
            >
              Create Chat
            </button>
          </div>
        </GroupChatModal>
      </Suspense>

      {myChats &&
        myChats.length > 0 &&
        myChats?.map((chat) => (
          <div
            key={chat._id}
            className={`mt-2
            w-[80%] flex justify-center items-center
            py-2 rounded-[8px]
          ${selectedChat._id === chat._id ? "bg-blue-400" : ""}
          `}
          >
            <p
              className={`
            ${selectedChat._id === chat._id ? "text-white font-semibold" : ""}
            `}
            >
              {!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
            </p>
          </div>
        ))}
    </div>
  );
};

export default MyChats;
