const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const { db } = require("./db/db.connect");
const userRoutes = require("./Routes/auth.routes");
const templateRoutes = require("./Routes/templates.route");
const bulkEmailRoute = require("./Routes/bulk_email_route");
const cookieParser = require("cookie-parser");
db();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(userRoutes);
app.use(templateRoutes);
app.use(bulkEmailRoute);

port = process.env.PORT || 8001;
app.get("/", (req, res) => {
  res.status(200).send("API is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
