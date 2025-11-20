import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import uploadRoutes from "./routes/upload.js"
import { initializeDatabase } from "./models/Analysis.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads")
import fs from "fs"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Initialize database
initializeDatabase()

// Routes
app.use("/api", uploadRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
