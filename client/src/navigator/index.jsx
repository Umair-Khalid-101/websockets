import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
// import socketIO from 'socket.io-client';

// SOCKET CONNECTION
// const socket = socketIO.connect('http://localhost:4000');

// SPLIT IMPORTS
const Login = lazy(() => import("../pages/Login"));
const SignUp = lazy(() => import("../pages/SignUp"));
const ChatPage = lazy(() => import("../pages/ChatPage"));

// CONTEXT
// import {useStateContext} from "../context"

const AppNavigator = () => {
  // const {setSocketInstance} = useStateContext()

  // useEffect(() => {
  //   setSocketInstance(socket)
  // }, [])

  return (
    <Suspense fallback={<div>Loading... </div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppNavigator;
