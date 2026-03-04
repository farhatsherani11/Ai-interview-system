import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function POST(req) {

  const formData = await req.formData();

  const response = await fetch("http://127.0.0.1:8000/analyze", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  const db = await connectDB();

  await db.collection("ats_reports").insertOne({
    userId: "USER_ID_HERE",
    jobDescription: formData.get("job_description"),
    score: result.score,
    similarity: result.similarity,
    missingSkills: result.missing_skills,
    feedback: result.feedback,
    createdAt: new Date()
  });

  return NextResponse.json(result);
}