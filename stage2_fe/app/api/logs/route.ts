import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const AUTH_URL = "http://20.207.122.201/evaluation-service/auth";
const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

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
  if (cachedToken && tokenExpiry > now + 60) {
    return cachedToken;
  }
  const res = await axios.post(AUTH_URL, CREDENTIALS);
  cachedToken = res.data.access_token;
  tokenExpiry = res.data.expires_in;
  return cachedToken!;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = await getValidToken();

    const response = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.text();
    return new NextResponse(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Proxy request failed" }, { status: 502 });
  }
}
