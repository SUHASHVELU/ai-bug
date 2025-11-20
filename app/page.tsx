"use client"

import { useState, useEffect } from "react"
import UploadForm from "@/frontend/src/components/UploadForm"
import Dashboard from "@/frontend/src/components/Dashboard"
import { getAnalyses } from "@/frontend/src/api"

export default function Page() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)

  useEffect(() => {
    loadAnalyses()
  }, [])

  const loadAnalyses = async () => {
    setLoading(true)
    try {
      const data = await getAnalyses()
      setAnalyses(data)
    } catch (error) {
      console.error("Failed to load analyses:", error)
    }
    setLoading(false)
  }

  const handleAnalysisComplete = (newAnalysis) => {
    const analysisData = {
      id: newAnalysis.id,
      originalFileName: newAnalysis.originalFileName,
      aiAnalysis: newAnalysis.aiAnalysis,
      uploadedAt: newAnalysis.uploadedAt,
    }
    setAnalyses([analysisData, ...analyses])
    setSelectedAnalysis(analysisData)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-white">Log-AI-Analyzer</h1>
          <p className="text-slate-400 mt-2 text-lg">AI-powered log analysis and bug tracking</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Upload */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <div className="bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-6">Upload Log</h2>
                <UploadForm onAnalysisComplete={handleAnalysisComplete} />
              </div>
            </div>
          </div>

          {/* Right Column - Analysis/Dashboard */}
          <div className="lg:col-span-3">
            {selectedAnalysis ? (
              <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                <Dashboard analysis={selectedAnalysis} />
              </div>
            ) : (
              <div className="bg-slate-800 rounded-xl shadow-2xl p-12 border border-slate-700 text-center h-full flex items-center justify-center min-h-96">
                <p className="text-slate-400 text-lg">Select an analysis or upload a new log file to get started</p>
              </div>
            )}

            {analyses.length > 0 && (
              <div className="mt-8 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700 bg-slate-900">
                  <h3 className="text-xl font-bold text-white">Previous Analyses</h3>
                </div>
                <div className="divide-y divide-slate-700 max-h-96 overflow-y-auto">
                  {analyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      onClick={() => setSelectedAnalysis(analysis)}
                      className={`p-4 cursor-pointer transition-all duration-200 ${
                        selectedAnalysis?.id === analysis.id
                          ? "bg-slate-700 border-l-4 border-blue-500"
                          : "hover:bg-slate-750 border-l-4 border-transparent"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-white truncate">{analysis.originalFileName}</p>
                          <p className="text-sm text-slate-400 mt-1">
                            {new Date(analysis.uploadedAt).toLocaleDateString()} at{" "}
                            {new Date(analysis.uploadedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <span
                          className={`ml-4 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                            analysis.aiAnalysis.severity === "Critical"
                              ? "bg-red-900/40 text-red-300 border border-red-700"
                              : analysis.aiAnalysis.severity === "High"
                                ? "bg-orange-900/40 text-orange-300 border border-orange-700"
                                : analysis.aiAnalysis.severity === "Medium"
                                  ? "bg-yellow-900/40 text-yellow-300 border border-yellow-700"
                                  : "bg-green-900/40 text-green-300 border border-green-700"
                          }`}
                        >
                          {analysis.aiAnalysis.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
