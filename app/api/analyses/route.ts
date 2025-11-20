import { analysesStore } from "../analyze/route"

export async function GET() {
  try {
    const analyses = Array.from(analysesStore.values())
    console.log("[v0] Fetching all analyses:", analyses.length)

    return Response.json(analyses)
  } catch (error) {
    console.error("[v0] Fetch analyses error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to fetch analyses" },
      { status: 500 },
    )
  }
}
