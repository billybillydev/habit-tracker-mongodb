import { InferSchemaType, model, Schema } from "mongoose";

const sessionSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    expires_at: {
      type: Date,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
  } as const,
  { _id: false }
);

export type Session = InferSchemaType<typeof sessionSchema>;
export const Session = model("Session", sessionSchema);
