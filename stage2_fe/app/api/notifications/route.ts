import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const AUTH_URL = "http://20.207.122.201/evaluation-service/auth";
const NOTIFICATIONS_URL = "http://20.207.122.201/evaluation-service/notifications";

// Server-side credentials — user is assumed pre-authorized per evaluation doc
const CREDENTIALS = {
  email: "kb5234@srmist.edu.in",
  name: "kunal bishwal",
  rollNo: "ra2311056010327",
  accessCode: "QkbpxH",
  clientID: "cdc90152-fcef-4669-aed6-86edfe7c7f1a",
  clientSecret: "pPRzXyZeNEeZcrRd",
};

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getValidToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  // Refresh if expired or will expire within 60 seconds
  if (cachedToken && tokenExpiry > now + 60) {
    return cachedToken;
  }

  const res = await axios.post(AUTH_URL, CREDENTIALS);
  cachedToken = res.data.access_token;
  tokenExpiry = res.data.expires_in; // Unix timestamp of expiry
  return cachedToken!;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  const url = `${NOTIFICATIONS_URL}${queryString ? `?${queryString}` : ""}`;

  try {
    const token = await getValidToken();
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    // If token was rejected, force-refresh and retry once
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      cachedToken = null;
      try {
        const token = await getValidToken();
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return NextResponse.json(response.data);
      } catch (retryError: unknown) {
        const msg = retryError instanceof Error ? retryError.message : "Unknown error";
        return NextResponse.json(
          { error: "Failed to fetch notifications after token refresh", details: msg },
          { status: 500 }
        );
      }
    }
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const status = axios.isAxiosError(error) ? error.response?.status || 500 : 500;
    return NextResponse.json(
      { error: "Failed to fetch notifications", details: errorMessage },
      { status: status }
    );
  }
}
