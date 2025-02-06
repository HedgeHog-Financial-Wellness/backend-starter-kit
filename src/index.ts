// BASE EXPRESS SERVER
// import { main } from "./framework/express/server.js";

// main();


// express-zod-api example
import { createConfig, createServer } from "express-zod-api";
import routing from "./routes/home/home.routes.js";

const config = createConfig({
    http: {
        listen: 4000,
    },
    cors: true,
});

createServer(config, routing);
