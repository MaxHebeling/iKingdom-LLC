import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";

export async function POST() {
  try {
    const redis = await getRedisClient();

    await redis.set("item", "Hola desde Redis");
    const result = await redis.get("item");

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Redis test failed:", error);
    return NextResponse.json(
      { error: "No se pudo conectar a Redis" },
      { status: 500 }
    );
  }
}
