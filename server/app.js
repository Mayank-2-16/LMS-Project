const express = require("express");
const app = express();

const connecttoDB = require("./src/db/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const session = require("express-session");
const jwt = require("jsonwebtoken");

const authRouter = require("./src/router/auth.router");
const authRoutes = require("./src/router/auth.routes");
const userRoutes = require("./src/router/user.router");
const twoFactorRoutes = require("./src/router/twoFactor.router");
const protectedRoutes = require("./src/router/protected.router");
const loginRoutes = require("./src/router/login.router");
const logoutRoutes = require("./src/router/logout.router");
const registerRoutes = require("./src/router/register.router");
const courseDetailsRoutes = require("./src/router/coursedetails.router");
const videoRoutes = require("./src/router/video.router");
const courseRoutes = require("./src/router/course.router");
const quizRoutes = require("./src/router/quiz.router")
const instructorRoutes = require("./src/router/instructor.router")
const messageRoutes = require("./src/router/message.router")

const verifyToken = require("./src/utils/verifyToken");

dotenv.config();
require("./passport");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api", authRouter);

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(cors(corsOptions));

app.use(
    session({
        secret: "secretcodekey",
        resave: true,
        saveUninitialized: false,
    })
);

/******************************************************************************************************************************* 
                                                   GOOGLE TWO FACTOR AUTHENTICATION
*******************************************************************************************************************************/

app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/2fa", twoFactorRoutes);
app.use("/protected", protectedRoutes);

/******************************************************************************************************************************* 
                                                      AUTHENTICATION ROUTES
*******************************************************************************************************************************/

app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/logout", logoutRoutes);
app.use("/coursedetails", verifyToken, courseDetailsRoutes);
app.use("/video", verifyToken, videoRoutes);
app.use("/course", courseRoutes);

app.use('/quiz', quizRoutes);
app.use('/instructor', instructorRoutes);

app.use('/message', messageRoutes);

app.get("*", (req, res) => {
    res.status(404).json({ error: "Not Found" });
});

const server = app.listen(3000, () => {
    console.log("App listening on port 3000!");
});

require("./src/utils/wsConnection")(server);
