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

/**
 * Analyze a claim denial letter against an insurance policy and generate an appeal letter
 * @param {string} policyText - Raw text extracted from the policy
 * @param {string} denialText - Raw text extracted from the denial letter
 * @returns {Object} - Appeal data containing denial reasoning, policy analysis, key arguments, and formal letter
 */
const generateAppealLetter = async (policyText, denialText) => {
  const modelsToTry = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];
  let lastError = null;

  const prompt = `
You are an expert insurance claims appeal specialist and consumer advocate. Your job is to help ordinary people write legally structured appeal letters when their claims are denied.

Analyze the following insurance policy text and the claim denial letter. Cross-reference the denial reasoning with the policy terms, coverage clauses, and definitions. Find points where the policy covers the denied event or where the denial reasoning is weak, ambiguous, or incorrect.

Provide your response in JSON format matching this exact structure:

{
  "denialReason": "A 2-3 sentence clear summary of why the insurance company states the claim was denied.",
  "policyAnalysis": "A clear, plain-English analysis of the policy clauses. Explain how they relate to the denial, why the denial may be incorrect/incomplete, or what specific sections support the appeal.",
  "keyArguments": [
    "A concise, strong bullet point argument for the appeal (e.g. 'The policy covers emergency room visits with a $150 co-pay, but the insurer billed this as out-of-network outpatient service.')",
    "Another strong key argument"
  ],
  "appealLetter": "The complete, formal, legally structured appeal letter in markdown format. Use formal business language. Use standard placeholders in brackets like [Your Name], [Policy Number], [Claim Number], [Date of Service], [Date of Denial Letter], [Insurer Address], etc., where appropriate. Reference specific policy sections and page numbers (if determinable) to construct a firm, professional, and convincing letter."
}

--- INSURANCE POLICY TEXT START ---
${policyText}
--- INSURANCE POLICY TEXT END ---

--- CLAIM DENIAL LETTER TEXT START ---
${denialText}
--- CLAIM DENIAL LETTER TEXT END ---

Return ONLY the JSON object, no additional text or markdown formatting outside of the JSON.
`;

  for (const modelName of modelsToTry) {
    try {
      console.log(`🤖 Sending texts to Gemini AI (${modelName}) for appeal letter generation...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await callGeminiWithRetry(model, prompt);
      const response = await result.response;
      let responseText = response.text();

      responseText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const appealData = JSON.parse(responseText);
      console.log(`✅ AI appeal generation complete with model: ${modelName}`);
      return appealData;
    } catch (error) {
      console.warn(`⚠️ Model ${modelName} failed on appeal: ${error.message}`);
      lastError = error;
    }
  }

  console.error('❌ AI Service Error: Appeal generation failed for all models');
  if (lastError instanceof SyntaxError) {
    throw new Error('AI returned an invalid response format for appeal. Please try again.');
  }
  throw new Error(`Appeal generation failed: ${lastError.message}`);
};

/**
 * Compare two insurance policies side-by-side
 * @param {string} policyAText - Raw text from policy/quote A
 * @param {string} policyBText - Raw text from policy/quote B
 * @returns {Object} - Structured comparison data
 */
const comparePolicies = async (policyAText, policyBText) => {
  const modelsToTry = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];
  let lastError = null;

  const prompt = `
You are an expert insurance comparison analyst. Your job is to generate a comprehensive, structured side-by-side comparison of two insurance policies or quotes.

Analyze both policy/quote texts. Extract their key details (premium, deductible, waiting periods, limits, key covered features, exclusion risks, etc.) and create a comparison grid. Finally, provide a clear recommendation on which policy is a better choice and why.

Provide your response in JSON format matching this exact structure:

{
  "policyA": {
    "name": "Short name for Policy A (e.g. Star Health Optima)",
    "type": "Type of insurance (e.g. Health Insurance)"
  },
  "policyB": {
    "name": "Short name for Policy B (e.g. HDFC Ergo Optima Secure)",
    "type": "Type of insurance"
  },
  "comparisonGrid": [
    {
      "feature": "Name of the feature or limit (e.g. Monthly Premium, Deductible, Co-pay, Inpatient Room Rent Limit, Pre-existing Disease Waiting Period, Maternity Coverage, etc.)",
      "policyAValue": "Value or status in Policy A (specific and clear)",
      "policyBValue": "Value or status in Policy B (specific and clear)",
      "comparison": "Brief comparison analysis notes",
      "winner": "policyA" or "policyB" or "tie"
    }
  ],
  "winnerRecommendation": "A thorough, 2-3 paragraph recommendation explaining which policy offers better value, who each policy is best suited for, and warning about any hidden traps or gotchas in either policy."
}

--- POLICY A TEXT START ---
${policyAText}
--- POLICY A TEXT END ---

--- POLICY B TEXT START ---
${policyBText}
--- POLICY B TEXT END ---

Return ONLY the JSON object, no additional text or markdown formatting outside of the JSON.
`;

  for (const modelName of modelsToTry) {
    try {
      console.log(`🤖 Sending texts to Gemini AI (${modelName}) for side-by-side comparison...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await callGeminiWithRetry(model, prompt);
      const response = await result.response;
      let responseText = response.text();

      responseText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const comparisonData = JSON.parse(responseText);
      console.log(`✅ AI comparison complete with model: ${modelName}`);
      return comparisonData;
    } catch (error) {
      console.warn(`⚠️ Model ${modelName} failed on comparison: ${error.message}`);
      lastError = error;
    }
  }

  console.error('❌ AI Service Error: Policy comparison failed for all models');
  if (lastError instanceof SyntaxError) {
    throw new Error('AI returned an invalid response format for comparison. Please try again.');
  }
  throw new Error(`Policy comparison failed: ${lastError.message}`);
};

/**
 * Answer an employee benefits question based on the policy text
 * @param {string} policyText - Raw text from the corporate group insurance policy
 * @param {string} question - Employee question (e.g. "Does my plan cover dental checkups?")
 * @returns {string} - Plain English answer response
 */
const answerBenefitQuestion = async (policyText, question) => {
  const modelsToTry = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];
  let lastError = null;

  const prompt = `
You are a friendly, professional corporate HR Benefits Assistant. Your job is to help employees understand their group insurance policy by answering their benefits questions in a clear, polite, and simple way.

Base your answer ONLY on the provided insurance policy document text. Do not make assumptions or bring in outside knowledge.

RULES:
1. Be direct, clear, and extremely polite.
2. If the treatment/treatment type/service is covered, list any associated copays, deductibles, limits, or pre-authorizations mentioned.
3. If it is excluded, state clearly that it is not covered by the current plan.
4. If the document does not contain enough information to answer, state: "I couldn't find details about this in our policy documents. Please consult our HR Benefits team directly for clarification."
5. Format your response in clean markdown paragraphs (and bullet points if listing conditions). Keep it under 250 words.

Employee Question: "${question}"

--- INSURANCE POLICY TEXT START ---
${policyText}
--- INSURANCE POLICY TEXT END ---

Return ONLY the plain English response. Do not include JSON wrappers or code block markers.
`;

  for (const modelName of modelsToTry) {
    try {
      console.log(`🤖 Sending question to Gemini AI (${modelName}) for benefits QA...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await callGeminiWithRetry(model, prompt);
      const response = await result.response;
      const responseText = response.text().trim();

      console.log(`✅ Benefits QA complete with model: ${modelName}`);
      return responseText;
    } catch (error) {
      console.warn(`⚠️ Model ${modelName} failed on benefits QA: ${error.message}`);
      lastError = error;
    }
  }

  console.error('❌ AI Service Error: Benefits QA failed for all models');
  throw new Error(`QA response generation failed: ${lastError.message}`);
};

module.exports = {
  simplifyPolicy,
  generateAppealLetter,
  comparePolicies,
  answerBenefitQuestion,
};
