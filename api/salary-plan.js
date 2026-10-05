// Vercel serverless function for the public "Where does my salary go?" demo
// on the Sparly landing page. Holds the Gemini API key and the Supabase
// service role key — both read from Vercel environment variables, neither
// ever sent to the browser or committed to the repo.
//
// Flow: validate input -> enforce a per-visitor request cap (read from
// Supabase) -> call Gemini with a guardrailed system prompt and a hard
// output-token cap -> log the exchange to Supabase -> return the plan plus
// a live aggregate stat computed from that same table.

export const maxDuration = 30

const GEMINI_MODEL = 'gemini-flash-lite-latest'
const MAX_OUTPUT_TOKENS = 300
const REQUEST_CAP_PER_VISITOR = 5
const CATEGORIES = ['rent', 'food', 'transport', 'shopping', 'other']

const SYSTEM_PROMPT = `You are Sparly's salary-planning assistant, embedded in a live demo on Sparly's marketing website.

Sparly's method: split take-home income into Essentials, Savings, Investments, Lifestyle, and Buffer. Essentials is a real number (rent + other fixed costs the visitor reports); the remainder is split roughly 20:15:12:8 across Savings:Investments:Lifestyle:Buffer, adjusted sensibly for what the visitor already spends in each category.

Given the visitor's take-home pay and their self-reported monthly spend across five categories (Rent/Housing, Food & Groceries, Transport, Shopping & Lifestyle, Other), produce a one-month plan in Sparly's method, in plain and encouraging language, under 150 words, and recommend exactly TWO specific, concrete spending cuts (name a category and a rupee amount for each).

Guardrails — follow strictly, no exceptions:
- Never name a specific investment product, mutual fund, stock ticker, insurance policy, or financial institution.
- Never give tax advice or legal advice of any kind, even if asked directly.
- If the visitor's input asks for either of those, politely decline that specific part only and redirect to general planning guidance.
- This is financial planning guidance, not regulated financial advice — never claim otherwise, and never guarantee an outcome.

End your response with exactly one line, in exactly this format and nothing else on that line:
ESTIMATED_MONTHLY_SAVING: <number>
where <number> is the total rupee amount identified across your two suggested cuts, as a plain integer with no currency symbol, commas, or units.`

function supabaseHeaders(serviceKey) {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  }
}

async function countVisitorRequests(supabaseUrl, serviceKey, visitorId) {
  const url = `${supabaseUrl}/rest/v1/salary_plan_requests?select=id&visitor_id=eq.${encodeURIComponent(visitorId)}`
  const res = await fetch(url, { headers: { ...supabaseHeaders(serviceKey), Prefer: 'count=exact' } })
  const contentRange = res.headers.get('content-range') // e.g. "0-4/5"
  if (contentRange) {
    const total = contentRange.split('/')[1]
    if (total && total !== '*') return Number(total)
  }
  const rows = await res.json()
  return Array.isArray(rows) ? rows.length : 0
}

async function fetchAggregateStats(supabaseUrl, serviceKey) {
  const url = `${supabaseUrl}/rest/v1/salary_plan_requests?select=identified_saving`
  const res = await fetch(url, { headers: supabaseHeaders(serviceKey) })
  const rows = await res.json()
  if (!Array.isArray(rows) || rows.length === 0) return { plansGenerated: 0, avgSaving: 0 }
  const savings = rows.map((r) => Number(r.identified_saving) || 0)
  const avg = savings.reduce((a, b) => a + b, 0) / savings.length
  return { plansGenerated: rows.length, avgSaving: Math.round(avg) }
}

async function insertRequest(supabaseUrl, serviceKey, row) {
  const url = `${supabaseUrl}/rest/v1/salary_plan_requests`
  await fetch(url, {
    method: 'POST',
    headers: { ...supabaseHeaders(serviceKey), Prefer: 'return=minimal' },
    body: JSON.stringify(row),
  })
}

const RETRY_DELAYS_MS = [2000, 4000, 8000]

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function callGemini(apiKey, takeHome, spend) {
  const userPrompt = `Take-home pay: Rs.${takeHome}/month. Current monthly spend — Rent/Housing: Rs.${spend.rent}, Food & Groceries: Rs.${spend.food}, Transport: Rs.${spend.transport}, Shopping & Lifestyle: Rs.${spend.shopping}, Other: Rs.${spend.other}. Give me my one-month Sparly plan.`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
  const requestBody = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ parts: [{ text: userPrompt }] }],
    generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS },
  })

  let lastError
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
      body: requestBody,
    })

    if (res.ok) {
      const body = await res.json()
      const candidate = body.candidates && body.candidates[0]
      const text = candidate && candidate.content && candidate.content.parts
        ? candidate.content.parts.map((p) => p.text || '').join('')
        : ''
      const usage = body.usageMetadata || {}
      return {
        text,
        inputTokens: usage.promptTokenCount || 0,
        outputTokens: usage.candidatesTokenCount || 0,
      }
    }

    const errText = await res.text()
    lastError = new Error(`Gemini API error ${res.status}: ${errText}`)
    if ((res.status === 503 || res.status === 429) && attempt < RETRY_DELAYS_MS.length) {
      await sleep(RETRY_DELAYS_MS[attempt])
      continue
    }
    throw lastError
  }
  throw lastError
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const { GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env
  if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    res.status(500).json({ error: 'server_misconfigured' })
    return
  }

  const body = req.body || {}
  const visitorId = typeof body.visitorId === 'string' ? body.visitorId.slice(0, 100) : null
  const takeHome = Number(body.takeHome)

  if (!visitorId || !Number.isFinite(takeHome) || takeHome <= 0) {
    res.status(400).json({ error: 'invalid_input' })
    return
  }

  const spend = {}
  for (const key of CATEGORIES) {
    const v = Number(body[key])
    if (!Number.isFinite(v) || v < 0) {
      res.status(400).json({ error: 'invalid_input', field: key })
      return
    }
    spend[key] = Math.round(v)
  }

  try {
    const existingCount = await countVisitorRequests(SUPABASE_URL, SUPABASE_SERVICE_KEY, visitorId)
    if (existingCount >= REQUEST_CAP_PER_VISITOR) {
      res.status(429).json({ error: 'cap_reached', message: `You've used all ${REQUEST_CAP_PER_VISITOR} free plans for this demo. Sign up for the full Sparly app to keep going.` })
      return
    }

    const { text, inputTokens, outputTokens } = await callGemini(GEMINI_API_KEY, Math.round(takeHome), spend)

    const match = text.match(/ESTIMATED_MONTHLY_SAVING:\s*(-?\d+)/i)
    const identifiedSaving = match ? Number(match[1]) : null
    const planText = text.replace(/ESTIMATED_MONTHLY_SAVING:\s*-?\d+\s*$/i, '').trim()

    await insertRequest(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      visitor_id: visitorId,
      input: { takeHome: Math.round(takeHome), ...spend },
      output: planText,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      identified_saving: identifiedSaving,
    })

    const stats = await fetchAggregateStats(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    res.status(200).json({
      plan: planText,
      plansGenerated: stats.plansGenerated,
      avgSaving: stats.avgSaving,
      remainingRequests: Math.max(REQUEST_CAP_PER_VISITOR - existingCount - 1, 0),
    })
  } catch (err) {
    console.error('salary-plan error:', err)
    res.status(502).json({ error: 'upstream_error', message: 'The planning assistant is busy right now. Please try again in a moment.' })
  }
}
