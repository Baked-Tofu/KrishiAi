import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });

/**
 * Ask Gemini a question, optionally with RAG context pulled from Supabase.
 * @param {string} question - the user's question (already translated to English if needed)
 * @param {string} contextText - relevant knowledge-base chunks to ground the answer
 */
export async function askGemini(question, contextText = '') {
  const prompt = contextText
    ? `You are a helpful assistant for Indian cooperative society members and farmers.
Use ONLY the following official context to answer. If the context doesn't contain
the answer, say you're not sure and suggest they consult their local cooperative
officer. Keep the answer simple and in plain language, no jargon.

CONTEXT:
${contextText}

QUESTION: ${question}

ANSWER:`
    : `You are a helpful assistant for Indian cooperative society members and farmers.
Answer simply and in plain language, no jargon.

QUESTION: ${question}

ANSWER:`;

  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}

/**
 * Ask Gemini about an image (e.g. a crop photo).
 * @param {string} prompt
 * @param {string} base64Data - image bytes, base64 encoded
 * @param {string} mimeType - e.g. image/jpeg
 */
export async function askGeminiWithImage(prompt, base64Data, mimeType = 'image/jpeg') {
  const result = await geminiModel.generateContent([
    prompt,
    { inlineData: { data: base64Data, mimeType } },
  ]);
  return result.response.text();
}
