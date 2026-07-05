// backend/services/aiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Call Gemini API with automatic retry on 429 Rate Limit (Quota Exceeded) errors
 */
const callGeminiWithRetry = async (model, prompt, retries = 3, initialDelay = 12000) => {
  let delayMs = initialDelay;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (error) {
      const errorMsg = error.message || '';
      const isRateLimit = 
        errorMsg.includes('429') || 
        errorMsg.toLowerCase().includes('quota') || 
        errorMsg.includes('ResourceExhausted') || 
        errorMsg.toLowerCase().includes('too many requests');
      
      if (isRateLimit && attempt < retries) {
        console.warn(`⚠️ Gemini API Rate Limited (429). Retrying attempt ${attempt}/${retries} in ${delayMs / 1000}s...`);
        await delay(delayMs);
        delayMs = delayMs * 1.5; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
};

/**
 * Simplify insurance policy text using Google Gemini AI
 * @param {string} extractedText - Raw text extracted from the policy document
 * @returns {Object} - Structured simplified summary
 */
const simplifyPolicy = async (extractedText) => {
  // Try gemini-3.5-flash first, then fall back to 2.5-flash, 2.0-flash-lite, and 2.0-flash
  const modelsToTry = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];
  let lastError = null;

  const prompt = `
You are an expert insurance policy analyst and consumer advocate. Your job is to help ordinary people understand their insurance policies by translating complex legal and technical language into simple, clear, everyday English.

Analyze the following insurance policy text and provide a structured summary in JSON format. Be thorough, accurate, and always prioritize the policyholder's understanding.

IMPORTANT RULES:
1. Use simple, everyday language — imagine explaining to someone with no insurance knowledge.
2. Highlight anything that could surprise the policyholder or affect their claims.
3. Be specific — don't use vague language like "certain conditions apply."
4. If something is unclear in the original text, say so explicitly.
5. Always err on the side of caution — warn about potential pitfalls.

Return your response as a valid JSON object with this exact structure:

{
  "overview": "A 2-3 sentence plain English summary of what this policy is and what it does for the policyholder.",
  "policyType": "The type of insurance (e.g., Health Insurance, Auto Insurance, Home Insurance, Life Insurance, Travel Insurance, etc.)",
  "coverage": [
    {
      "item": "What is covered (short title)",
      "description": "Plain English explanation of this coverage",
      "limit": "The maximum amount or limit for this coverage, if mentioned"
    }
  ],
  "exclusions": [
    {
      "item": "What is NOT covered (short title)",
      "description": "Why this exclusion matters to you",
      "impact": "How this could affect you if you need to make a claim"
    }
  ],
  "conditions": [
    {
      "condition": "The condition or requirement",
      "explanation": "What this means in plain English and what you need to do",
      "importance": "low | medium | high | critical"
    }
  ],
  "claimProcess": "Step-by-step explanation of how to file a claim in simple terms",
  "keyNumbers": {
    "premium": "How much you pay and how often (monthly/annually)",
    "deductible": "How much you pay out of pocket before insurance kicks in",
    "maxCoverage": "The maximum amount the insurance will pay",
    "waitingPeriod": "How long you must wait before coverage begins"
  },
  "warnings": [
    "Important warning or red flag that the policyholder should know about"
  ],
  "recommendations": [
    "Actionable recommendation for the policyholder"
  ]
}

If any field cannot be determined from the text, use "Not specified in the document" as the value.

--- INSURANCE POLICY TEXT START ---
${extractedText}
--- INSURANCE POLICY TEXT END ---

Return ONLY the JSON object, no additional text or markdown formatting.
`;

  for (const modelName of modelsToTry) {
    try {
      console.log(`🤖 Sending text to Gemini AI (${modelName}) for simplification...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      // Call API with retry helper
      const result = await callGeminiWithRetry(model, prompt);
      const response = await result.response;
      let responseText = response.text();

      // Clean up response — remove markdown code blocks if present
      responseText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      // Parse JSON response
      const simplifiedData = JSON.parse(responseText);

      console.log(`✅ AI simplification complete with model: ${modelName}`);
      return simplifiedData;
    } catch (error) {
      console.warn(`⚠️ Model ${modelName} failed or limit exceeded: ${error.message}`);
      lastError = error;
      // Continue to the next model in the list
    }
  }

  // If all models failed, throw a descriptive error
  console.error('❌ AI Service Error: All fallback models failed');
  
  if (lastError instanceof SyntaxError) {
    throw new Error(
      'AI returned an invalid response format. Please try again.'
    );
  }

  throw new Error(`AI simplification failed: ${lastError.message}`);
};

module.exports = { simplifyPolicy };
