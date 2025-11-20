import express from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { sanitizeText } from "../utils/sanitize.js"
import { analyzeWithAI } from "../services/aiClient.js"
import { saveAnalysis, getAnalyses, getAnalysisById } from "../models/Analysis.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const router = express.Router()

// Configure multer
const uploadDir = path.join(__dirname, "../../uploads")
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedExts = [".log", ".txt"]
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedExts.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error("Only .log and .txt files are allowed"))
    }
  },
})

// Upload and analyze endpoint
router.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    // Read file content
    const fileContent = fs.readFileSync(req.file.path, "utf-8")

    // Sanitize content
    const sanitizedContent = sanitizeText(fileContent)

    // Analyze with AI
    const aiAnalysis = await analyzeWithAI(sanitizedContent)

    // Save to database
    const analysis = await saveAnalysis({
      originalFileName: req.file.originalname,
      sanitizedContent,
      aiAnalysis,
      uploadedAt: new Date().toISOString(),
    })

    res.json({
      success: true,
      message: "File analyzed successfully",
      analysisId: analysis.id,
      analysis: analysis.aiAnalysis,
    })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({
      error: error.message || "Analysis failed",
    })
  }
})

// Get all analyses
router.get("/analyses", async (req, res) => {
  try {
    const analyses = await getAnalyses()
    res.json(analyses)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single analysis
router.get("/analyses/:id", async (req, res) => {
  try {
    const analysis = await getAnalysisById(req.params.id)
    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found" })
    }
    res.json(analysis)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
