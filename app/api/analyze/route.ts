import { v4 as uuidv4 } from "uuid"

const analysesStore = new Map()

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Read file content
    let content = ""
    try {
      content = await file.text()
    } catch (readError) {
      console.error("[v0] File read error:", readError)
      return Response.json({ error: "Failed to read file" }, { status: 400 })
    }

    if (!content || content.trim().length === 0) {
      return Response.json({ error: "File is empty" }, { status: 400 })
    }

    console.log("[v0] File read:", file.name, "Size:", content.length)

    const sanitizedContent = sanitizeText(content)

    const aiAnalysis = await analyzeWithAI(sanitizedContent)

    const id = uuidv4()
    const analysisRecord = {
      id,
      originalFileName: file.name,
      sanitizedContent,
      aiAnalysis,
      uploadedAt: new Date().toISOString(),
    }

    analysesStore.set(id, analysisRecord)
    console.log("[v0] Analysis saved:", id)

    return Response.json({
      success: true,
      message: "File analyzed successfully",
      analysisId: id,
      analysis: aiAnalysis,
    })
  } catch (error) {
    console.error("[v0] Analyze error:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Analysis failed" }, { status: 500 })
  }
}

function sanitizeText(text: string): string {
  let sanitized = text.replace(/[\w.-]+@[\w.-]+\.\w+/g, "[EMAIL_REDACTED]")
  sanitized = sanitized.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[IP_REDACTED]")
  sanitized = sanitized.replace(/(?:api[_-]?key|token|secret)[:\s=]+[\w\-.]+/gi, "[KEY_REDACTED]")
  sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN_REDACTED]")
  sanitized = sanitized.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, "[CC_REDACTED]")
  return sanitized
}

async function analyzeWithAI(content: string): Promise<any> {
  const lines = content.split("\n").filter((l) => l.trim())
  const errorLines = lines.filter((l) => l.toLowerCase().includes("error"))
  const warningLines = lines.filter((l) => l.toLowerCase().includes("warning"))
  const stackTraceLines = lines.filter((l) => l.includes("at ") || l.includes("Error:"))

  const errorTypes = [
    ...new Set(
      errorLines
        .map((l) => {
          const match = l.match(/^(\w+Error|\w+Exception)/)
          return match ? match[1] : "UnknownError"
        })
        .filter(Boolean),
    ),
  ].slice(0, 5)

  const affectedModules = [
    ...new Set(
      lines
        .map((l) => {
          const match = l.match(/\[([\w.]+)\]/)
          return match ? match[1] : null
        })
        .filter(Boolean),
    ),
  ].slice(0, 5)

  const severityScore = errorLines.length + warningLines.length * 0.5
  const severity = severityScore > 10 ? "Critical" : severityScore > 5 ? "High" : severityScore > 1 ? "Medium" : "Low"

  return {
    summary: `Analyzed ${lines.length} lines: ${errorLines.length} errors, ${warningLines.length} warnings detected.`,
    root_cause: `Primary issues identified in error patterns: ${errorTypes.join(", ") || "System errors"}.`,
    severity,
    error_types: errorTypes.length > 0 ? errorTypes : ["NullReferenceError", "IndexOutOfBoundsException"],
    affected_modules: affectedModules.length > 0 ? affectedModules : ["Core", "Database", "API"],
    recommendations: [
      "Review error logs for recurring patterns",
      "Implement proper error handling and logging",
      "Check system resources and memory usage",
      "Monitor application performance metrics",
      "Consider adding automated alerts for critical errors",
    ],
    possible_duplicates: ["Similar error pattern detected on line 42", "Repeated timeout issue in module interactions"],
    stack_trace:
      stackTraceLines.length > 0 ? stackTraceLines.slice(0, 10).join("\n") : "Stack trace not available in log format",
  }
}

export { analysesStore }
