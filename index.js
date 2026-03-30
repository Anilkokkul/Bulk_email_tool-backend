const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const { db } = require("./db/db.connect");
const userRoutes = require("./Routes/auth.routes");
const templateRoutes = require("./Routes/templates.route");
const bulkEmailRoute = require("./Routes/bulk_email_route");
const mailingListRoutes = require("./Routes/mailing_list.routes");
const historyRoutes = require("./Routes/history.routes");
const webhookRoutes = require("./Routes/webhook.routes");
const cookieParser = require("cookie-parser");
db();
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') ,
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT"],
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(userRoutes);
app.use(templateRoutes);
app.use(bulkEmailRoute);
app.use(mailingListRoutes);
app.use("/api", historyRoutes);
app.use("/api/webhooks", webhookRoutes);

port = process.env.PORT || 8001;
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Bulk Email Tool API</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f2f5;
            color: #333;
          }
          .container {
            text-align: center;
            background: white;
            padding: 3rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #2563eb;
            margin-bottom: 1rem;
          }
          p {
            font-size: 1.1rem;
            color: #64748b;
            margin: 0;
          }
          .status {
            display: inline-block;
            margin-top: 1.5rem;
            padding: 0.5rem 1rem;
            background-color: #dcfce7;
            color: #166534;
            border-radius: 9999px;
            font-weight: 500;
            font-size: 0.9rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Bulk Email Tool API</h1>
          <p>The backend service is up and running.</p>
          <div class="status">● System Online</div>
        </div>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
