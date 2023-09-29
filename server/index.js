const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

connectDB();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log("GET REQ at EndPoint: `/`");
  res.json("API IS RUNNING");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`server started on port: ${PORT}`));
