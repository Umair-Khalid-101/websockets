import React from "react";
import { toast } from "react-toastify";
import axios from "axios";

// CONTEXT
import { useStateContext } from "../context";

// CONSTANTS
import { apiUrl } from "../constants";

const SearchInput = () => {
  const { search, setSearch, setSearching, setSearchResults, user } =
    useStateContext();

  // HANDLE SEARCH TEXT
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const doSearch = async (e) => {
    if (e.key === "Enter") {
      if (!search) {
        toast.info("Type Something to Search!", {
          position: "top-right",
        });
        return;
      }

      try {
        setSearching(true);
        // console.log("GETTING: ", search);
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };

        const { data } = await axios.get(
          `${apiUrl}/api/user/allusers?search=${search}`,
          config
        );

        setSearching(false);
        // console.log(data);
        setSearchResults(data);
      } catch (error) {
        toast.error("Failed to Load the Search Results!", {
          position: "top-right",
        });
        setSearching(false);
        return;
      }
    }
  };
  return (
    <div className="relative text-gray-600 focus-within:text-gray-400 mt-4">
      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
        <button
          type="submit"
          className="p-1 focus:outline-none focus:shadow-outline"
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.351-4.351M15 10.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
            ></path>
          </svg>
        </button>
      </span>
      <input
        type="text"
        className="py-2 pl-14 pr-8 rounded-[8px] text-sm focus:outline-none focus:bg-white focus:text-gray-900
        border border-gray-200
        "
        placeholder="Search..."
        onChange={(e) => handleSearch(e)}
        onKeyUp={(e) => doSearch(e)}
      />
    </div>
  );
};

export default SearchInput;
