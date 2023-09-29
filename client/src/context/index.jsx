import React, { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // NAVIGATOR
  const navigate = useNavigate();

  // STATES
  const [user, setUser] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState();
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState();
  const [myChats, setMyChats] = useState([]);
  const [groupModelOpen, setGroupModelOpen] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [chatInfoModalOpen, setChatInfoModalOpen] = useState(false);
  const [groupChatModal, setGroupChatModal] = useState(false);
  // const [socketInstance, setSocketInstance] = useState(null)

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <StateContext.Provider
      value={{
        user,
        setUser,
        isOpen,
        setIsOpen,
        search,
        setSearch,
        searching,
        setSearching,
        searchResults,
        setSearchResults,
        loadingChat,
        setLoadingChat,
        selectedChat,
        setSelectedChat,
        myChats,
        setMyChats,
        groupModelOpen,
        setGroupModelOpen,
        fetchAgain,
        setFetchAgain,
        profileModalOpen,
        setProfileModalOpen,
        chatInfoModalOpen,
        setChatInfoModalOpen,
        groupChatModal,
        setGroupChatModal,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
