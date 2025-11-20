const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api"

export async function uploadAndAnalyze(file) {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Upload failed")
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Upload error:", error)
    throw error
  }
}

export async function getAnalyses() {
  try {
    const response = await fetch(`${API_BASE}/analyses`)
    if (!response.ok) throw new Error("Failed to fetch analyses")
    return await response.json()
  } catch (error) {
    console.error("[v0] Fetch analyses error:", error)
    return []
  }
}

export async function getAnalysisById(id) {
  try {
    const response = await fetch(`${API_BASE}/analyses/${id}`)
    if (!response.ok) throw new Error("Analysis not found")
    return await response.json()
  } catch (error) {
    console.error("[v0] Fetch analysis error:", error)
    return null
  }
}
