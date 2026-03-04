"use client"
import Link from "next/link";

export default function ATSCard() {
  return (
    <Link href="/dashboard/ats-system">
      <div className="border rounded-xl p-10 bg-gray-100 hover:bg-green-100 transition-all cursor-pointer shadow-sm hover:shadow-md">
        <h2 className="text-xl font-bold text-center">
          📄 Resume ATS Score
        </h2>
        <p className="text-gray-500 text-center mt-2">
          Analyze and improve your resume
        </p>
      </div>
    </Link>
  );
}