import type { Routing } from "express-zod-api";
import { helloWorldEndpoint } from "./home.schema.js";

const routing: Routing = {
  v1: {
    hello: helloWorldEndpoint,
  },
};

export default routing;