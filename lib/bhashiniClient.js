// Bhashini API wrapper — STT (speech-to-text) and TTS (text-to-speech)
// Docs: https://bhashini.gov.in (developer portal)
//
// NOTE: Bhashini's real API requires a two-step flow:
//   1. Call the "pipeline config" endpoint to get the right service ID +
//      callback URL for your chosen language/task (asr, tts, translation).
//   2. Call that returned endpoint with your actual audio/text payload.
// Fill in BHASHINI_API_KEY / BHASHINI_USER_ID / BHASHINI_ULCA_API_KEY in .env.local
// once your developer account is approved. Until then, these functions are stubbed
// so the rest of the app can be built and tested independently.

const BHASHINI_CONFIG_URL = 'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline';

export async function speechToText(audioBase64, sourceLanguage = 'hi') {
  if (!process.env.BHASHINI_ULCA_API_KEY) {
    console.warn('Bhashini not configured yet — returning stub STT result');
    return '[STT stub: configure BHASHINI keys to enable real transcription]';
  }

  // TODO: replace with real Bhashini pipeline call once account is approved
  // const configRes = await fetch(BHASHINI_CONFIG_URL, { ... })
  // then POST audioBase64 to the returned compute endpoint

  throw new Error('Bhashini STT not yet wired up — see TODO in bhashiniClient.js');
}

export async function textToSpeech(text, targetLanguage = 'hi') {
  if (!process.env.BHASHINI_ULCA_API_KEY) {
    console.warn('Bhashini not configured yet — returning stub TTS result');
    return null; // frontend should handle null by using browser SpeechSynthesis as fallback
  }

  // TODO: replace with real Bhashini pipeline call once account is approved

  throw new Error('Bhashini TTS not yet wired up — see TODO in bhashiniClient.js');
}

export async function translateText(text, sourceLanguage, targetLanguage) {
  if (!process.env.BHASHINI_ULCA_API_KEY) {
    console.warn('Bhashini not configured yet — returning original text unmodified');
    return text;
  }

  throw new Error('Bhashini translation not yet wired up — see TODO in bhashiniClient.js');
}
