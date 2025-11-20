"use client"

import { useState, useEffect } from "react"
import UploadForm from "./components/UploadForm"
import Dashboard from "./components/Dashboard"
import { getAnalyses } from "./api"

function App() {
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
    setAnalyses([newAnalysis, ...analyses])
    setSelectedAnalysis(newAnalysis)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Log-AI-Analyzer</h1>
          <p className="text-slate-400 mt-1">AI-powered log analysis and bug tracking</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700 sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-4">Upload Log</h2>
              <UploadForm onAnalysisComplete={handleAnalysisComplete} />
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedAnalysis ? (
              <Dashboard analysis={selectedAnalysis} />
            ) : (
              <div className="bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700 text-center">
                <p className="text-slate-400">Select an analysis or upload a new log file to get started</p>
              </div>
            )}

            {analyses.length > 0 && (
              <div className="mt-8 bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700">
                  <h3 className="text-xl font-semibold text-white">Previous Analyses</h3>
                </div>
                <div className="divide-y divide-slate-700 max-h-96 overflow-y-auto">
                  {analyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      onClick={() => setSelectedAnalysis(analysis)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedAnalysis?.id === analysis.id ? "bg-slate-700" : "hover:bg-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white truncate">{analysis.originalFileName}</p>
                          <p className="text-sm text-slate-400">
                            {new Date(analysis.uploadedAt).toLocaleDateString()} at{" "}
                            {new Date(analysis.uploadedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            analysis.aiAnalysis.severity === "Critical"
                              ? "bg-red-900 text-red-200"
                              : analysis.aiAnalysis.severity === "High"
                                ? "bg-orange-900 text-orange-200"
                                : analysis.aiAnalysis.severity === "Medium"
                                  ? "bg-yellow-900 text-yellow-200"
                                  : "bg-green-900 text-green-200"
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

export default App
