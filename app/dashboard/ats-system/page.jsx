"use client"
import { useState } from "react";

export default function ATSPage() {

  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jd);

    const res = await fetch("/api/ats", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold">ATS Resume Analyzer</h2>

      <textarea
        placeholder="Paste Job Description"
        className="border p-3 w-full mt-4"
        onChange={(e) => setJd(e.target.value)}
      />

      <input
        type="file"
        className="mt-4"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
      >
        Analyze Resume
      </button>

      {result && (
        <div className="mt-6 border p-4 rounded">
          <h3 className="text-xl font-bold">ATS Score: {result.score}%</h3>
          <p>Similarity: {result.similarity}</p>

          <h4 className="mt-4 font-semibold">Missing Skills:</h4>
          <ul>
            {result.missing_skills.map((skill, i) => (
              <li key={i}>• {skill}</li>
            ))}
          </ul>

          <h4 className="mt-4 font-semibold">AI Feedback:</h4>
          <pre className="whitespace-pre-wrap">
            {result.feedback}
          </pre>
        </div>
      )}
    </div>
  );
}