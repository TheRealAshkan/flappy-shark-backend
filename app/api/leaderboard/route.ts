import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "leaderboard.json");

export async function GET() {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // مرتب‌سازی بر اساس امتیاز (بیشترین امتیاز اول)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.sort((a: any, b: any) => b.score - a.score);

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
