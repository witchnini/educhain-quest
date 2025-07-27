
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set. Using mocked data.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const quizSchema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: 'The quiz question.'
    },
    options: {
      type: Type.ARRAY,
      description: 'An array of 4 multiple choice options.',
      items: { type: Type.STRING }
    },
    correctAnswerIndex: {
      type: Type.INTEGER,
      description: 'The 0-based index of the correct answer in the options array.'
    }
  },
  required: ['question', 'options', 'correctAnswerIndex']
};

const mockQuestion: QuizQuestion = {
  question: "This is a mock question because the API key is not configured. What is 2 + 2?",
  options: ["3", "4", "5", "6"],
  correctAnswerIndex: 1
};


export const generateQuizQuestion = async (topic: string): Promise<QuizQuestion> => {
  if (!process.env.API_KEY) {
    return Promise.resolve(mockQuestion);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a single, multiple-choice quiz question about "${topic}". The question should have 4 options and one correct answer.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    // Basic validation
    if (
      !parsedJson.question ||
      !Array.isArray(parsedJson.options) ||
      parsedJson.options.length !== 4 ||
      typeof parsedJson.correctAnswerIndex !== 'number'
    ) {
      throw new Error("Invalid quiz question format received from API.");
    }
    
    return parsedJson as QuizQuestion;

  } catch (error) {
    console.error("Error generating quiz question:", error);
    // Fallback to mock question on API error
    return mockQuestion;
  }
};
