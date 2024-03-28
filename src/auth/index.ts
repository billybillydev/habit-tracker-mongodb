import { Google } from "arctic";
import { config } from "../config";
import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite";
import { Lucia } from "lucia";
import { User } from "$db/schema";
import { client } from "$db";

export type GoogleProfile = {
  id: string;
  name: string;
  given_name: string;
  family_name: string;
  link: string;
  picture: string;
  gender: string;
  locale: string;
};

export type SessionUser = {
  id: User["id"];
  name: User["name"];
  email?: User["email"];
};

const { credentials, redirectURI } = config.google;

const googleAuth = new Google(
  credentials.clientId,
  credentials.clientSecret,
  redirectURI.href
);

const adapter = new LibSQLAdapter(client, {
  user: "users",
  session: "sessions",
});


export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // we don't need to expose the hashed password!
      email: attributes.email,
      name: attributes.name,
      id: attributes.id,
    };
  },
});

export const auth = {
  google: googleAuth,
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: SessionUser;
  }
}