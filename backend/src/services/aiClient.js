import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

export async function analyzeWithAI(sanitizedLogs) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in environment variables")
  }

  const prompt = `You are an expert log analyzer and bug tracker. Analyze the following sanitized log content and provide a structured JSON response ONLY.

Log Content:
${sanitizedLogs}

Return ONLY valid JSON with this exact schema:
{
  "summary": "Brief overview of what the logs show",
  "root_cause": "Identified root cause of issues",
  "error_types": ["list", "of", "error", "types"],
  "affected_modules": ["list", "of", "affected", "modules"],
  "severity": "Low | Medium | High | Critical",
  "recommendations": ["actionable", "recommendations"],
  "possible_duplicates": ["duplicate", "error", "patterns"],
  "stack_trace": "Important stack trace or error chain"
}

Return ONLY the JSON object, no additional text.`

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert log analyzer. Return ONLY valid JSON output, no other text.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      },
    )

    const content = response.data.choices[0].message.content.trim()

    // Parse JSON response
    let jsonResponse
    try {
      jsonResponse = JSON.parse(content)
    } catch (e) {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonResponse = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Failed to parse AI response as JSON")
      }
    }

    return jsonResponse
  } catch (error) {
    console.error("AI API Error:", error.response?.data || error.message)
    throw new Error(`AI Analysis failed: ${error.message}`)
  }
}
