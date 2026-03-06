import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();
    const reports = await db
      .collection("ats_reports")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const serialized = reports.map((r) => ({
      ...r,
      _id: r._id.toString(),
    }));

    return NextResponse.json(serialized);

  } catch (err) {s
    console.error("History fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch history." },
      { status: 500 }
    );
  }
}