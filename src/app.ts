import configureOpenAPI from "@/lib/configure-open-api.js";
import createApp from "@/lib/create-app.js";
import ideasRoute from "@/routes/ideas/idea.index.js";
import indexRoute from "@/routes/index.route.js";
import tasksRoute from "@/routes/tasks/tasks.index.js";

const app = createApp();

const routes = [indexRoute, tasksRoute, ideasRoute];

routes.forEach((route) => {
  app.route("/", route);
});

configureOpenAPI(app);

export default app;
