import express, { Router, type Express } from "express";

export function createApp() {

    const app: Express = express();

    app.get("/", (req, res) => {
        res.send("Hello World");
    });

    return app;
}
