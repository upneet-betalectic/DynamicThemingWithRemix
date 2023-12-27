import { createCookieSessionStorage } from "@remix-run/node";

let { commitSession, destroySession, getSession } = createCookieSessionStorage({
  cookie: {
    name: "session",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    secrets: ["mysecret"],
  },
});

export { commitSession, destroySession, getSession };
