import { config } from "$config";
import { type User } from "$db/models";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { Google } from "arctic";
import { Lucia } from "lucia";
import mongoose from "mongoose";

export type GoogleProfile = {
  id: string;
  name: string;
  email: string;
  verified_email: boolean;
  given_name: string;
  family_name: string;
  picture: string;
};

export type SessionUser = {
  id: string;
  name: User["name"];
  email: User["email"];
};

const { credentials, redirectURI } = config.google;

const googleAuth = new Google(
  credentials.clientId,
  credentials.clientSecret,
  redirectURI.href
);

const adapter = new MongodbAdapter(
  mongoose.connection.collection("sessions"),
  mongoose.connection.collection("users")
);


export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getSessionAttributes(databaseSessionAttributes) {
    return databaseSessionAttributes
  },
  getUserAttributes: (attributes) => {
    return {
      // we don't need to expose the hashed password!
      email: attributes.email,
      name: attributes.name,
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