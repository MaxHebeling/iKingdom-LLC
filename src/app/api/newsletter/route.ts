import { NextRequest, NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 },
      );
    }

    const redis = await getRedisClient();
    await redis.sAdd("newsletter:subscribers", email.trim().toLowerCase());

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter signup failed:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
