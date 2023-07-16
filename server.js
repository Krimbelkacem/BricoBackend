const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const upload = require("./api/config/multer");

const port = 3000;
const router = require("./api/routes/router");

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());
app.use(router);
app.use(express.static("public"));

mongoose
  .connect("mongodb://0.0.0.0:27017/Bricodb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Middleware to parse JSON bodies

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
