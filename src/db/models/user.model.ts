import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
  _id: { type: String, required: true },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  googleId: {
    type: String,
    unique: false, // Not using Mongoose's unique constraint
    sparse: true, // Allows null values to be excluded from the index
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // Ensure that the email is unique
    validate: {
      validator: function (v: string) {
        return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]/.test(v);
      },
      message: ({ value }: { value: string }) =>
        `${value} is not a valid email!`,
    },
  },
  password: {
    type: String,
  },
  authType: {
    type: String,
    required: [true, "Auth type is required"],
    enum: ["basic", "google"], // Restrict values to "basic" or "google"
  },
}).index({ googleId: 1 }, { unique: true, sparse: true });

export type User = InferSchemaType<typeof userSchema>;
export const User = model("User", userSchema);
