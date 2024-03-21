import React, { useEffect, useState, Suspense, lazy } from "react";
import { Vortex } from "react-loader-spinner";
import { toast } from "react-toastify";
import axios from "axios";

// CONTEXT
import { useStateContext } from "../context";
import { getSender, getSenderFull } from "../config/chatLogics";

// CONSTANTS
import { apiUrl } from "../constants";

// COMPONENT
import SingleChat from "./SingleChat";
import ChatInfoModel from "./ChatInfoModel";
// import UpdateGroupChatModal from "./UpdateGroupChatModal";
import UserBadgeItem from "./UserBadgeItem";
const ListItem = lazy(() => import("./ListItem"));

const ChatBox = () => {
  const {
    selectedChat,
    user,
    setChatInfoModalOpen,
    setGroupChatModal,
    setSelectedChat,
    fetchAgain,
    setFetchAgain,
  } = useStateContext();
  const [groupChatName, setGroupChatName] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryResults, setSearchQueryResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const openModal = () => {
    setChatInfoModalOpen(true);
  };

  const closeModal = () => {
    setChatInfoModalOpen(false);
    setSearchQueryResults(false);
  };

  const openGroupChatModal = () => {
    setGroupChatModal(true);
  };

  const closeGroupChatModal = () => {
    setGroupChatModal(false);
  };

  // HANDLE SEARCH
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // USEEFFECT FOR IMMEDIATE STATE UPDATE
  useEffect(() => {
    const getSearchedUsers = async () => {
      if (!searchQuery) {
        return;
      }

      if (searchQuery.length > 2) {
        try {
          setLoading(true);
          console.log("Search Query: ", searchQuery);
          const config = {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          };

          const { data } = await axios.get(
            `${apiUrl}/api/user/allusers?search=${searchQuery}`,
            config
          );

          console.log("Searched Users: ", data);
          setSearchQueryResults(data);
          setLoading(false);
        } catch (error) {
          toast.error("Failed to Load Search Results!", {
            position: "top-right",
          });
          setLoading(false);
        }
      }
    };

    getSearchedUsers();
  }, [searchQuery]);

  // HANDLE GROUP
  const handleGroup = (userToAdd) => {
    // console.log("User to add: ", userToAdd);
    // if (selectedUsers.includes(userToAdd)) {
    //   toast.info("User already added!", {
    //     position: "top-right",
    //   });
    //   return;
    // }

    // setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, userToAdd]);
    alert(userToAdd);
  };

  // HANDLE RENAME
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.put(
        `${apiUrl}/api/chat/rename`,
        {
          chatId: selectedChat?._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.error("Failed to update chat name", {
        position: "top-right",
      });
      setRenameLoading(false);
    }

    setGroupChatName("");
  };

  // HANDLE ADD USER
  const handleAddUser = async (user1) => {
    if (selectedChat?.users.find((u) => u._id === user1._id)) {
      toast.info("User already in group!", {
        position: "top-right",
      });
      return;
    }

    if (selectedChat?.groupAdmin?._id !== user?._id) {
      toast.error("Only Admin can Add Someone!", {
        position: "top-right",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.put(
        `${apiUrl}/api/chat/groupadd`,
        {
          chatId: selectedChat?._id,
          userId: user1?._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error("Could Not Add User!", {
        position: "top-right",
      });
      setLoading(false);
    }
  };

  // HANDLE REMOVE USER
  const handleRemove = async (user1) => {
    if (
      selectedChat?.groupAdmin?._id !== user?._id &&
      user1?._id !== user?._id
    ) {
      toast.error("Only Admin can remove someone", {
        position: "top-right",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.put(
        `${apiUrl}/api/chat/groupremove`,
        {
          chatId: selectedChat?._id,
          userId: user1?._id,
        },
        config
      );

      user1?._id === user?._id ? setSelectedChat() : setSelectedChat(data);
      user1?._id === user?._id ? closeModal() : null;
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error("Could Not Remove User!", {
        position: "top-right",
      });
      setLoading(false);
    }
  };

  // HANDLE LEAVE GROUP
  const handleLeave = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.put(
        `${apiUrl}/api/chat/groupremove`,
        {
          chatId: selectedChat?._id,
          userId: user?._id,
        },
        config
      );

      setSelectedChat();
      setFetchAgain(!fetchAgain);
      setLoading(false);
      closeModal();
    } catch (error) {
      toast.error("Could Not Leave Group!", {
        position: "top-right",
      });
      setLoading(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      {selectedChat?.isGroupChat && (
        <header
          className={`
        ${
          selectedChat &&
          `py-2 cursor-pointer 
        bg-blue-400 rounded-[8px]
        hover:bg-blue-500 duration-75`
        }
      `}
          onClick={() => openModal()}
        >
          <p
            className="font-semibold text-[20px] ml-4
          text-white
          "
          >
            {selectedChat?.chatName}
          </p>
        </header>
      )}
      {!selectedChat?.isGroupChat && (
        <header
          className={`
          ${
            selectedChat &&
            `py-2 cursor-pointer 
          bg-blue-400 rounded-[8px]
          hover:bg-blue-500 duration-75`
          }
        `}
          onClick={() => openModal()}
        >
          <p
            className="font-semibold text-[20px]
        ml-4 text-white"
          >
            {selectedChat && getSender(user, selectedChat.users)}
          </p>
        </header>
      )}
      {/* HEADER */}
      <ChatInfoModel onClose={closeModal}>
        {selectedChat && selectedChat?.isGroupChat ? (
          <>
            <div
              className="flex justify-center items-center flex-col gap-4
          "
            >
              <h1 className="font-semibold text-[20px]">
                {selectedChat?.chatName}
              </h1>
              <div
                className="flex justify-start items-center w-[80%]
              gap-4
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
                {!renameLoading ? (
                  <button
                    className="bg-green-400 px-12 py-2 rounded-[8px]
              text-white flex justify-center items-center
              hover:bg-green-600 hover:font-semibold duration-75
              "
                    onClick={() => handleRename()}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    className="bg-green-400 px-12 py-2 rounded-[8px]
            text-white flex justify-center items-center
            hover:bg-green-600 hover:font-semibold duration-75
            "
                    disabled={true}
                  >
                    <Vortex
                      visible={true}
                      height="30"
                      width="30"
                      ariaLabel="vortex-loading"
                      wrapperStyle={{}}
                      wrapperClass="vortex-wrapper"
                      colors={[
                        "white",
                        "white",
                        "white",
                        "white",
                        "white",
                        "white",
                      ]}
                    />
                  </button>
                )}
              </div>
              <input
                type="text"
                className="py-2 pl-2 pr-8 rounded-[8px] text-sm focus:outline-none 
              focus:bg-white focus:text-gray-900
              border border-gray-200 w-[80%]"
                placeholder="Search Users to Add, At least 3 characters"
                onChange={(e) => handleSearch(e)}
              />
            </div>

            <div className="my-4 flex justify-start items-center gap-4">
              {selectedChat?.users?.map((user) => (
                <UserBadgeItem
                  user={user}
                  key={user._id}
                  handleFunction={() => handleRemove(user)}
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
                    <ListItem
                      data={user}
                      handleChat={() => handleAddUser(user)}
                    />
                  </Suspense>
                ))
              )}
            </div>

            <div className="flex justify-center items-center mt-4">
              <button
                className="bg-red-400
            text-white px-12 py-3 rounded-[8px]
            hover:bg-red-600 duration-75
            text-[14px] font-semibold
            flex justify-center items-center gap-2"
                onClick={() => handleLeave()}
              >
                Leave Group
              </button>
            </div>
          </>
        ) : (
          <div
            className="flex flex-col justify-center items-center
          mt-8 gap-4
          "
          >
            <img
              src={
                selectedChat && getSenderFull(user, selectedChat?.users)?.pic
              }
              alt="userpic"
              className="w-52 h-52 rounded-full"
            />
            <div className="flex flex-col justify-center items-center">
              <p className="font-semibold text-[28px]">
                {selectedChat && getSenderFull(user, selectedChat?.users)?.name}
              </p>
              <p className="font-semibold text-[26px]">
                {selectedChat &&
                  getSenderFull(user, selectedChat?.users)?.email}
              </p>
            </div>
          </div>
        )}
      </ChatInfoModel>
      {/* <UpdateGroupChatModal onClose={closeGroupChatModal}>
        <div>Update Group Chat Modal</div>
      </UpdateGroupChatModal> */}
      <SingleChat />
    </>
  );
};

export default ChatBox;
