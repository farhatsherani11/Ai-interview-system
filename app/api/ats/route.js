

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const formData = await req.formData();

    let response;
    try {
      // Add timeout of 60 seconds
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      response = await fetch("http://127.0.0.1:8001/analyze", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeout);

    } catch (fetchError) {
      if (fetchError.name === "AbortError") {
        return NextResponse.json(
          { error: "Request timed out. The analysis is taking too long." },
          { status: 504 }
        );
      }
      return NextResponse.json(
        { error: "Python backend is not running. Please start it on port 8001." },
        { status: 503 }
      );
    }

    if (!response.ok) {
      const text = await response.text();
      console.error("Python backend error:", text);
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: 500 }
      );
    }

    const result = await response.json();

    const db = await connectDB();
    await db.collection("ats_reports").insertOne({
      userId: "USER_ID_HERE",
      jobDescription: formData.get("job_description"),
      score: result.score,
      similarity: result.similarity,
      missingSkills: result.missing_skills,
      overallMatch: result.overall_match,
      strengths: result.strengths,
      grammarFixes: result.grammar_fixes,
      bulletRewrites: result.bullet_rewrites,
      strategicAdvice: result.strategic_advice,
      createdAt: new Date(),
    });

    return NextResponse.json(result);

  } catch (err) {
    console.error("ATS route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}



