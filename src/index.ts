import { Hono } from "hono";
import { cors } from "hono/cors";
import { user } from "./routes/user";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();


app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000", "https://clone-riverside.vercel.app"],
  })
);

app.route("/api/v1/user", user)
export default app;
