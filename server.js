const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const sanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");

dotenv.config({ path: "./config/config.env" });

connectDB();

const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const user = require("./routes/users");
const review = require("./routes/reviews");

const app = express();

app.use(express.json());

app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(fileupload());

app.use(sanitize());

app.use(helmet());

app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
});

app.use(limiter);

app.use(hpp());

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", user);
app.use("/api/v1/reviews", review);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);

  server.close(() => process.exit(1));
});
