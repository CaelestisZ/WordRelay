const express = require("express");
const morgan = require("morgan");
const path = require("path");

const scoreRouter = require("./routes/scoreRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

    next();
});

app.use(express.static("./client/build"));

app.get(["/", "/game", "/leaderboard"], (req, res) => {
    res.sendFile("index.html", {
        root: "client/build/",
    });
});

app.use("/api/v1/scores", scoreRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
