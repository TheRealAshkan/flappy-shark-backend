import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "leaderboard.json");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const password = searchParams.get("password");

    if (!password) {
      return NextResponse.json({ error: "password is required" }, { status: 400 });
    }

    if(password != 'sharkkiller') {
        return NextResponse.json({ error: "password is required" }, { status: 400 });
    }
    
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newData = data.filter((item: any) => item.username !== username);

    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));

    return NextResponse.json({ message: `User '${username}' deleted successfully!` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
