import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "leaderboard.json");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const score = Number(searchParams.get("score"));

    if (!username || isNaN(score)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // خواندن داده‌های فعلی
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // چک کن ببین کاربر وجود داره یا نه
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = data.find((item: any) => item.username === username);
    if (existing) {
      existing.score = Math.max(existing.score, score); // فقط اگر امتیاز جدید بیشتر بود
    } else {
      data.push({ username, score });
    }

    // ذخیره در فایل
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ message: "Score saved successfully!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
