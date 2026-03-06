"use client"
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ATSPage() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  // Fetch history on page load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/ats/history");
      const data = await res.json();
      if (!data.error) setHistory(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const handleSubmit = async () => {
    if (!file || !jd) return alert("Please provide both a resume and job description.");
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedReport(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_description", jd);
      const res = await fetch("/api/ats", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || data.error) { setError(data.error || "Something went wrong."); return; }
      setResult(data);
      fetchHistory(); // refresh history after new submission
    } catch (err) {
      setError("Failed to connect. Make sure the Python backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const matchColor = {
    High: "text-green-600 bg-green-100",
    Medium: "text-yellow-600 bg-yellow-100",
    Low: "text-red-600 bg-red-100",
  };

  const scoreColor = (val) => {
    if (val >= 75) return "text-green-600";
    if (val >= 45) return "text-yellow-500";
    return "text-red-600";
  };

  // Normalize report from MongoDB (camelCase) or API (snake_case)
  const normalize = (r) => ({
    score: r.score,
    similarity: r.similarity,
    overall_match: r.overall_match || r.overallMatch,
    strengths: r.strengths || [],
    missing_skills: r.missing_skills || r.missingSkills || [],
    grammar_fixes: r.grammar_fixes || r.grammarFixes || [],
    bullet_rewrites: r.bullet_rewrites || r.bulletRewrites || [],
    strategic_advice: r.strategic_advice || r.strategicAdvice,
    createdAt: r.createdAt,
    jobDescription: r.jobDescription,
  });

  const displayData = selectedReport ? normalize(selectedReport) : result ? normalize(result) : null;

  return (
    <div className="p-10 max-w-4xl mx-auto">

      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard">
          <button className="flex items-center gap-2 text-sm text-gray-600 border px-3 py-2 rounded-lg hover:bg-gray-100 transition">
            ← Back to Dashboard
          </button>
        </Link>
        <h2 className="text-2xl font-bold">📄 ATS Resume Analyzer</h2>
      </div>

      {/* Upload Form */}
      <div className="border rounded-xl p-6 shadow-sm mb-8">
        <textarea
          placeholder="Paste Job Description here..."
          className="border p-3 w-full rounded-md h-36 resize-none"
          onChange={(e) => setJd(e.target.value)}
        />
        <input type="file" accept=".pdf,.doc,.docx" className="mt-4 block" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white px-6 py-2 mt-4 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
        {error && <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">⚠️ {error}</div>}
      </div>

      {/* Past Reports List */}
      {history.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3">📋 Past Reports</h3>
          <div className="space-y-2">
            {history.map((report) => {
              const n = normalize(report);
              const isSelected = selectedReport?._id === report._id;
              return (
                <div
                  key={report._id}
                  onClick={() => { setSelectedReport(report); setResult(null); }}
                  className={`border rounded-xl p-4 cursor-pointer flex items-center justify-between transition hover:shadow-md ${isSelected ? "border-blue-500 bg-blue-50" : "bg-white"}`}
                >
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="text-sm text-gray-700 mt-1 truncate max-w-sm">
                      {report.jobDescription?.slice(0, 80)}...
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${scoreColor(n.score)}`}>{n.score}%</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${matchColor[n.overall_match] || "bg-gray-100 text-gray-600"}`}>
                      {n.overall_match}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Result Display */}
      {displayData && (
        <div className="space-y-6">
          {selectedReport && (
            <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
              📁 Viewing saved report from {new Date(selectedReport.createdAt).toLocaleDateString()}
              <button onClick={() => setSelectedReport(null)} className="ml-2 text-gray-400 hover:text-gray-600">✕ Close</button>
            </div>
          )}

          {/* Score + Similarity + Overall Match */}
          <div className="border rounded-xl p-6 shadow-sm grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">ATS Score</p>
              <p className={`text-5xl font-extrabold ${scoreColor(displayData.score)}`}>
                {displayData.score}<span className="text-2xl text-gray-400">%</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Similarity</p>
              <p className={`text-5xl font-extrabold ${scoreColor(displayData.similarity)}`}>
                {displayData.similarity}<span className="text-2xl text-gray-400">%</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Overall Match</p>
              <span className={`px-4 py-1 rounded-full font-semibold text-sm ${matchColor[displayData.overall_match] || "bg-gray-100 text-gray-600"}`}>
                {displayData.overall_match}
              </span>
            </div>
          </div>

          {/* Strengths */}
          <div className="border rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-bold mb-3"> Strengths</h3>
            <ul className="space-y-1">
              {displayData.strengths?.map((s, i) => <li key={i} className="text-green-700 flex gap-2"><span>•</span>{s}</li>)}
            </ul>
          </div>

          {/* Missing Skills */}
          <div className="border rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-bold mb-3"> Missing Skills</h3>
            <div className="flex flex-wrap gap-2">
              {displayData.missing_skills?.map((skill, i) => (
                <span key={i} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">{skill}</span>
              ))}
            </div>
          </div>

          {/* Grammar Fixes */}
          <div className="border rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-bold mb-3"> Grammar Fixes</h3>
            <ul className="space-y-1">
              {displayData.grammar_fixes?.map((fix, i) => <li key={i} className="text-gray-700 flex gap-2"><span>•</span>{fix}</li>)}
            </ul>
          </div>

          {/* Bullet Rewrites */}
          <div className="border rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-bold mb-3"> Bullet Rewrites</h3>
            <div className="space-y-4">
              {displayData.bullet_rewrites?.map((item, i) => (
                <div key={i} className="grid grid-cols-2 gap-4">
                  <div className="bg-red-50 p-3 rounded-lg"><p className="text-xs font-semibold text-red-500 mb-1">ORIGINAL</p><p className="text-sm text-gray-700">{item.original}</p></div>
                  <div className="bg-green-50 p-3 rounded-lg"><p className="text-xs font-semibold text-green-500 mb-1">IMPROVED</p><p className="text-sm text-gray-700">{item.improved}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Advice */}
          <div className="border rounded-xl p-5 shadow-sm bg-blue-50">
            <h3 className="text-lg font-bold mb-3">💡 Strategic Advice</h3>
            <p className="text-gray-700 leading-relaxed">{displayData.strategic_advice}</p>
          </div>

        </div>
      )}
    </div>
  );
}







