import NextAuth from "next-auth"
import { provider } from "./provider";
import { sessionCallback, signInCallback } from "./callback";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../prisma";

export const { auth, handlers, signIn, signOut } =
  NextAuth({
    basePath: "/api/auth",
    adapter: PrismaAdapter(prisma as any),
    providers: provider,
    session: {
      strategy: "database",
    },
    callbacks: {
        session: sessionCallback,
        signIn: signInCallback,
    },
    trustHost: true,
  })