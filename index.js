const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const { db } = require("./db/db.connect");
const userRoutes = require("./Routes/auth.routes");
const templateRoutes = require("./Routes/templates.route");
const bulkEmailRoute = require("./Routes/bulk_email_route");
const mailingListRoutes = require("./Routes/mailing_list.routes");
const cookieParser = require("cookie-parser");
db();
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://master--endearing-sable-5f4b83.netlify.app",
    "https://650401dc936e1c656e69c162--lambent-begonia-090e36.netlify.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT"],
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(userRoutes);
app.use(templateRoutes);
app.use(bulkEmailRoute);
app.use(mailingListRoutes);

port = process.env.PORT || 8001;
app.get("/", (req, res) => {
  res.status(200).send("API is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
