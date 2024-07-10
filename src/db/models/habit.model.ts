import { model, Schema, InferSchemaType } from "mongoose";

// Implements a validator which prevent two habits to have same title only if userId is same for both
const habitSchema = new Schema(
  {
    _id: { type: Schema.ObjectId, auto: true },
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: [250, "Title cannot exceed 250 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      validate: {
        validator: function (v: string) {
          return /^#([0-9A-F]{3}){1,2}$/i.test(v);
        },
        message: ({ value }: { value: string }) => `${value} is not a valid hexadecimal color!`,
      },
    },
    userId: {
      type: String,
      ref: "User",
      required: [true, "User ID is required"],
    },
    histories: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return Array.isArray(v) && new Set(v).size === v.length;
        },
        message: "Histories must contain unique dates.",
      },
    },
  },
  { timestamps: true }
);
// Create a compound index to ensure unique title per user
habitSchema.index({ title: 1, userId: 1 }, { unique: true });

export type Habit = InferSchemaType<typeof habitSchema>;
export const Habit = model("Habit", habitSchema);
