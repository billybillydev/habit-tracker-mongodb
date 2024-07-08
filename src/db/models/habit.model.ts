import { model, Schema, InferSchemaType } from "mongoose";

const habitSchema = new Schema(
  {
    _id: { type: Schema.ObjectId, auto: true },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    histories: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export type Habit = InferSchemaType<typeof habitSchema>;
export const Habit = model("Habit", habitSchema);
