import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "leaderboard.json");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get("password");
    
    if (!password) {
      return NextResponse.json({ error: "password is required" }, { status: 400 });
    }

    if(password != 'sharkkiller') {
        return NextResponse.json({ error: "password is required" }, { status: 400 });
    }
    

    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return NextResponse.json({ message: "Leaderboard reset successfully!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
