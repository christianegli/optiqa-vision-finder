# API Documentation

## AI Insights Endpoint
- **Endpoint:** https://api.anthropic.com/v1/messages
- **Purpose:** Receives user questionnaire answers and returns structured eyewear recommendations.
- **Method:** POST
- **Request Body:**
  - `model`: string (e.g., "claude-sonnet-4-20250514")
  - `max_tokens`: number
  - `messages`: array (user prompt and answers)
- **Response:**
  - `content`: array (AI-generated text summary)

## Notes
- This is a third-party API (Anthropic Claude).
- For MVP, no authentication or backend is implemented. 