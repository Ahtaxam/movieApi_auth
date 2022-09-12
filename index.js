const express = require("express");
const mongoose = require("mongoose");
const route = require("./routers/movie");
const userRoute = require("./routers/user");
const Auth = require("./routers/auth");
const app = express();

const port = 3000;
const url = "mongodb+srv://ahtasham:osmosm11@cluster0.xzw1puy.mongodb.net/test";

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to Mongodb");
  })
  .catch(() => {
    console.log("Error while connecting");
  });

app.use("/user", userRoute);
app.use("/movie", route);
app.use("/auth", Auth);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
