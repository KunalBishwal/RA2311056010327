import axios from "axios";

const LOG_API_URL = "/api/logs";

type LogLevel = "info" | "warn" | "error" | "debug";

export const Log = async (
  stack: string,
  level: LogLevel,
  pkg: string,
  message: string
): Promise<void> => {
  try {
    // No auth header needed — server-side proxy handles token
    await axios.post(LOG_API_URL, {
      stack,
      level,
      package: pkg,
      message,
    });
  } catch {
    // silent fail — logging should never break the app
  }
};