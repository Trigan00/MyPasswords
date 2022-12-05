const express = require("express");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth.routes");
const passwordRouter = require("./routes/password.routes");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // 5 requests,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  message: async (request, response) => {
    response.json({
      status: "failure",
      message: "Too many requests, please try again later.",
    });
  },
});

// app.use("/api/auth", limiter);

app.use("/api/auth", authRouter);
app.use("/api/passwords", passwordRouter);

app.get("/", (req, res) => {
  res.status(200).json("Сервер работает");
});

app.listen(PORT, () => console.log("SERVER STARTED ON PORT " + PORT));
