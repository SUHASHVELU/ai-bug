import { analysesStore } from "../../analyze/route"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const analysis = analysesStore.get(id)

    if (!analysis) {
      return Response.json({ error: "Analysis not found" }, { status: 404 })
    }

    console.log("[v0] Fetching analysis:", id)
    return Response.json(analysis)
  } catch (error) {
    console.error("[v0] Fetch analysis error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to fetch analysis" },
      { status: 500 },
    )
  }
}
