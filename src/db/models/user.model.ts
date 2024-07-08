import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
  _id: { type: String, required: true },
  name: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    unique: true, // Ensure that the googleId is unique
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure that the email is unique
  },
  password: {
    type: String,
    // select: false,
  },
  authType: {
    type: String,
    required: true,
    enum: ["basic", "google"], // Restrict values to "basic" or "google"
  },
});

export type User = InferSchemaType<typeof userSchema>;
export const User = model("User", userSchema);