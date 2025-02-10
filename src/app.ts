import configureOpenAPI from "@/lib/configure-open-api.js";
import createApp from "@/lib/create-app.js";
import ideasRoute from "@/routes/ideas/idea.index.js";

const app = createApp();

const routes = [ideasRoute];

routes.forEach((route) => {
  app.route("/", route);
});

configureOpenAPI(app);

export default app;
