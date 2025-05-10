import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

type userCreds = {
  email: string;
  password?: string;
  name: string;
  username?: string;
};

export const user = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    prisma: any;
  };
}>();

user.use("/*", async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  c.set("prisma", prisma);
  await next();
});

user.post("/sign-up", async (c) => {
  const { email, password, name, username }: userCreds = await c.req.json();
  const prisma = c.get("prisma");

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return c.json({ msg: "user already exist. Login" });
    } else {
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password,
          username,
        },
      });
      return c.json({ msg: "user created", newUser });
    }
  } catch (error) {
    console.error(error);
  }
});
