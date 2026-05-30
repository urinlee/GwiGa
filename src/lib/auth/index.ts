import NextAuth from "next-auth"
import { provider } from "./provider";
import { sessionCallback, signInCallback } from "./callback";

export const { auth, handlers, signIn, signOut } =
  NextAuth({
    providers:provider,
    session: {
      strategy: "database",
    },
    callbacks: {
        session: sessionCallback,
        signIn: signInCallback,
    }
  })