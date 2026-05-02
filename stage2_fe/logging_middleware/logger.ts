import axios from "axios";
import { getToken } from "../utils/token";

const LOG_API_URL = "/api/logs";

type LogLevel = "info" | "warn" | "error" | "debug";

export const Log = async (
  stack: string,
  level: LogLevel,
  pkg: string,
  message: string
): Promise<void> => {
  try {
    const token = getToken();

    await axios.post(
      LOG_API_URL,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch {
    // silent fail — logging should never break the app
  }
};