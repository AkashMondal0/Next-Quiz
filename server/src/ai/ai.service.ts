import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { textGeneratingModel } from 'src/lib/genAi';

@Injectable()
export class AiService {
  constructor(
    // private readonly redis: RedisProvider,
  ) { }

//   async modelGemini2Flash(
//     prompt: QuizPrompt
//   ): Promise<QuestionResponse[]> {
//     const numberOfQuestions = prompt.numberOfQuestions ?? 10;
//     const difficulty = prompt.difficulty ?? "easy";
//     const topic = prompt.topic?.trim();

//     if (!topic || topic.length < 3) {
//       throw new Error("Topic must be a non-empty string with at least 3 characters.");
//     }

//     if (numberOfQuestions <= 0 || numberOfQuestions > 100) {
//       throw new Error("Number of questions must be between 1 and 100.");
//     }

//     try {
//       const promptText = `You are a JSON API. Generate exactly ${numberOfQuestions} multiple-choice questions on the topic "${topic}" with "${difficulty}" difficulty.
// Respond only with a pure JSON array (no markdown, no explanation, no formatting), like:
// [
//   {
//     "text": "What is JavaScript primarily used for?",
//     "options": [
//       "Server-side scripting",
//       "Database management",
//       "Client-side web development",
//       "Mobile app development"
//     ],
//     "correctIndex": 2
//   }
// ]

// Requirements:
// - Output ONLY a valid JSON array
// - Each object must contain: "text", "options", and "correctIndex"
// - "options" must always contain exactly 4 strings
// - "correctIndex" must be a number from 0 to 3
// - All question texts and options must have proper spacing and be human-readable
// - Do NOT include any markdown (like \`\`\`), explanation, or non-JSON text`;

//       const result = await textGeneratingModel.generateContent([promptText]);

//       let rawText = result.response?.text?.();
//       if (!rawText) {
//         throw new Error("Empty response from the model.");
//       }

//       // 🔧 Clean output: remove markdown, comments, etc.
//       rawText = rawText.trim();

//       // Remove wrapping markdown code fences like ```json ... ```
//       if (rawText.startsWith("```")) {
//         rawText = rawText.replace(/^```[a-zA-Z]*\s*([\s\S]*?)\s*```$/, "$1").trim();
//       }

//       // Ensure it starts with [ and ends with ]
//       const jsonStart = rawText.indexOf("[");
//       const jsonEnd = rawText.lastIndexOf("]");
//       if (jsonStart === -1 || jsonEnd === -1) {
//         throw new Error("No JSON array found in model response.");
//       }

//       const jsonSlice = rawText.slice(jsonStart, jsonEnd + 1);

//       let parsed: unknown;
//       try {
//         parsed = JSON.parse(jsonSlice);
//       } catch (jsonError) {
//         console.error("Failed to parse cleaned JSON:", jsonSlice);
//         throw new Error("Model response could not be parsed as JSON.");
//       }

//       if (!Array.isArray(parsed)) {
//         throw new Error("Model response is not a JSON array.");
//       }

//       const validated: QuestionResponse[] = parsed.filter((q): q is QuestionResponse =>
//         typeof q?.text === "string" &&
//         Array.isArray(q?.options) &&
//         q.options.length === 4 &&
//         q.options.every((opt: any) => typeof opt === "string") &&
//         typeof q.correctIndex === "number" &&
//         q.correctIndex >= 0 &&
//         q.correctIndex < 4
//       );

//       if (validated.length !== numberOfQuestions) {
//         throw new Error(`Expected ${numberOfQuestions} questions, but received ${validated.length}.`);
//       }

//       return validated;
//     } catch (error: any) {
//       console.error("Quiz generation failed:", error);
//       throw new Error(error.message || "Unknown error occurred during quiz generation.");
//     }
//   }

//   async generateMainData(roomId: string, prompt: QuizPrompt): Promise<void> {
//     const key = `room:${roomId}`;
//     try {
//       const mainData = await this.modelGemini2Flash(prompt);
//       // save the generated data to Redis or database
//       // const existingData = await this.redis.client.get(key);
//       // const updatedData = existingData ? JSON.parse(existingData) : {};
//       // updatedData.main_data = mainData;
//       // await this.redis.client.set(key, JSON.stringify(updatedData));
//     } catch (error) {
//       // await this.redis.client.del(key);
//     }
//   }
}
