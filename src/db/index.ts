import { config } from "$config";
import { env } from "bun";
import { connect, disconnect, set } from "mongoose";

export const connectDB = async () => {
  try {
    if (env.NODE_ENV === "development") {
      set("debug", true);
    }
    await connect(config.db.url);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
};

export const disconnectDB = async () => {
  try {
    await disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error disconnecting from MongoDB', err);
  }
};

export async function handleDisconnectDBWhenExit(signal: string) {
  console.log(`Received ${signal}. Closing MongoDB connection...`);
  await disconnectDB();
  process.exit(0);
}