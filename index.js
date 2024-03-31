console.log("welcom Nodejs");
const express = require("express");
const cors = require("cors");
const userRoute = require("./routes");
require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

app.use(express.static("src"));

app.use(cors());

app.use(express.json());

app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
