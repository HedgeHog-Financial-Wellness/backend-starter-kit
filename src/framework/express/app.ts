import express, { Router, type Express } from "express";
import { openAPIRouter } from "./open-api/router.js";

export function createApp() {

    const app: Express = express();

    app.get("/", (req, res) => {
        res.send("Hello World");
    });

    // configure open api docs
    app.use("/api-docs", openAPIRouter);
    return app;
}
