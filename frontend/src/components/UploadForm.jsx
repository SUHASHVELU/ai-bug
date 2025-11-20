"use client"

import { useState } from "react"
import { uploadAndAnalyze } from "../api"

export default function UploadForm({ onAnalysisComplete }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.name.endsWith(".log") || selectedFile.name.endsWith(".txt")) {
        setFile(selectedFile)
        setError("")
      } else {
        setError("Please select a .log or .txt file")
        setFile(null)
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.name.endsWith(".log") || droppedFile.name.endsWith(".txt"))) {
      setFile(droppedFile)
      setError("")
    } else {
      setError("Please drop a .log or .txt file")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a file")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("[v0] Uploading file:", file.name, file.size)
      const response = await uploadAndAnalyze(file)
      console.log("[v0] Upload successful:", response)

      onAnalysisComplete({
        id: response.analysisId,
        originalFileName: file.name,
        aiAnalysis: response.analysis,
        uploadedAt: new Date().toISOString(),
      })
      setFile(null)
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) fileInput.value = ""
    } catch (err) {
      console.error("[v0] Upload error:", err)
      setError(err.message || "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-slate-500 transition-colors cursor-pointer bg-slate-700/20"
      >
        <input
          type="file"
          accept=".log,.txt"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
          disabled={loading}
        />
        <label htmlFor="file-input" className="cursor-pointer block">
          <svg className="mx-auto h-12 w-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-slate-200 font-medium">{file ? file.name : "Click to upload or drag a file"}</p>
          <p className="text-slate-400 text-sm mt-1">.log or .txt files</p>
        </label>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !file}
        className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        {loading ? "Analyzing..." : "Analyze Log"}
      </button>
    </form>
  )
}
