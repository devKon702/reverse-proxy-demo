const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// Import Routes
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

dotenv.config();
// Connect to MongoDB
async function connectMongoDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
}
connectMongoDB();

// Routes
app.use("/v1/auth", authRoute);
app.use("/v1/users", userRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening at port ${process.env.PORT}`);
});
