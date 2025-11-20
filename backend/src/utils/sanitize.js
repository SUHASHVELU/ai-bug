/**
 * Sanitize log content by removing sensitive information
 */
export function sanitizeText(text) {
  let sanitized = text

  // Remove email addresses
  sanitized = sanitized.replace(/[\w.-]+@[\w.-]+\.\w+/g, "[EMAIL_REDACTED]")

  // Remove phone numbers (various formats)
  sanitized = sanitized.replace(/(\+?1?\s?)?($$\d{3}$$|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/g, "[PHONE_REDACTED]")

  // Remove IP addresses
  sanitized = sanitized.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[IP_REDACTED]")

  // Remove UUIDs
  sanitized = sanitized.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "[UUID_REDACTED]")

  // Remove API keys (basic pattern)
  sanitized = sanitized.replace(/(?:api[_-]?key|apikey|secret)[:\s]*[^\s]+/gi, "[API_KEY_REDACTED]")

  // Remove credit card numbers
  sanitized = sanitized.replace(/\b(?:\d{4}[\s-]?){3}\d{4}\b/g, "[CARD_REDACTED]")

  // Remove social security numbers
  sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN_REDACTED]")

  return sanitized
}
