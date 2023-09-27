import React from "react";

// CONTEXT
import { useStateContext } from "../context";

const SearchUser = () => {
  const { user } = useStateContext();
  return <div>Hello {user.name}</div>;
};

export default SearchUser;
