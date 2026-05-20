import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";

export const AI_MODEL_NAMES = {
  CHAT: "meta-llama/llama-4-scout-17b-16e-instruct",
  QUICK: "llama-3.1-8b-instant",
  EMBEDDING: "gemini-embedding-001",
} as const;

export const chatModel = groq(AI_MODEL_NAMES.CHAT);
export const quickModel = groq(AI_MODEL_NAMES.QUICK);
export const embeddingModel = google.embedding(AI_MODEL_NAMES.EMBEDDING);
