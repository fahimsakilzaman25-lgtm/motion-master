
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

// Fix: Use process.env.API_KEY directly as required by the Gemini API coding guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generatePhysicsQuestions(): Promise<Question[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 15 unique, high-quality multiple-choice physics questions focusing exclusively on the three equations of motion:
    1. v = u + at
    2. s = ut + ½at²
    3. v² = u² + 2as
    
    The questions should vary in difficulty (easy, medium, hard). 
    Include scenarios like cars accelerating, free fall (g = 9.8m/s²), braking to a stop, and projectile start/stop moments.
    Ensure numerical values are realistic.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of 4 options (A, B, C, D)"
            },
            correctAnswer: { 
              type: Type.INTEGER, 
              description: "Index (0-3) of the correct option"
            },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  // Fix: Extract response text safely and trim before parsing JSON
  const text = response.text;
  if (!text) {
    throw new Error("Could not generate questions: AI returned an empty response.");
  }

  try {
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Could not generate questions. Please check your API key.");
  }
}

export async function getPerformanceFeedback(score: number, total: number): Promise<string> {
  const prompt = `A student just completed a physics quiz on Equations of Motion. 
  They scored ${score} out of ${total}. 
  Provide a short, encouraging, and highly professional performance analysis (2-3 sentences). 
  Focus on their understanding of v = u+at, s = ut+0.5at², and v² = u²+2as based on this score.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  // Fix: Access the text property directly as it is a getter, not a method
  return response.text || "Keep practicing the fundamental laws of kinematics to sharpen your problem-solving skills!";
}
