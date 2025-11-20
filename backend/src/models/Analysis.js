import sqlite3 from "sqlite3"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, "../../logs_analyzer.db")

let db

export function initializeDatabase() {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Database error:", err)
    } else {
      console.log("Connected to SQLite database")
    }
  })

  // Create table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_file_name TEXT NOT NULL,
      sanitized_content TEXT NOT NULL,
      ai_analysis TEXT NOT NULL,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export function saveAnalysis(data) {
  return new Promise((resolve, reject) => {
    const { originalFileName, sanitizedContent, aiAnalysis, uploadedAt } = data

    db.run(
      `INSERT INTO analyses (original_file_name, sanitized_content, ai_analysis, uploaded_at)
       VALUES (?, ?, ?, ?)`,
      [originalFileName, sanitizedContent, JSON.stringify(aiAnalysis), uploadedAt],
      function (err) {
        if (err) {
          reject(err)
        } else {
          resolve({
            id: this.lastID,
            originalFileName,
            aiAnalysis,
            uploadedAt,
          })
        }
      },
    )
  })
}

export function getAnalyses() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, original_file_name, ai_analysis, uploaded_at FROM analyses ORDER BY uploaded_at DESC`,
      (err, rows) => {
        if (err) {
          reject(err)
        } else {
          const analyses = rows.map((row) => ({
            id: row.id,
            originalFileName: row.original_file_name,
            aiAnalysis: JSON.parse(row.ai_analysis),
            uploadedAt: row.uploaded_at,
          }))
          resolve(analyses)
        }
      },
    )
  })
}

export function getAnalysisById(id) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, original_file_name, sanitized_content, ai_analysis, uploaded_at FROM analyses WHERE id = ?`,
      [id],
      (err, row) => {
        if (err) {
          reject(err)
        } else {
          if (row) {
            resolve({
              id: row.id,
              originalFileName: row.original_file_name,
              sanitizedContent: row.sanitized_content,
              aiAnalysis: JSON.parse(row.ai_analysis),
              uploadedAt: row.uploaded_at,
            })
          } else {
            resolve(null)
          }
        }
      },
    )
  })
}
