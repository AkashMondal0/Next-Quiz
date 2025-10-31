import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/lib/db/redis/redis.service';
import { textGeneratingModel } from 'src/lib/genAi';
import { QuestionResponse, QuizPrompt } from 'src/lib/types';
import { RoomSession } from 'src/quiz/entities/quiz.entity';

@Injectable()
export class AiService {
  constructor(
    private readonly redis: RedisService,
  ) { }

  async modelGemini2Flash(
    prompt: QuizPrompt
  ): Promise<QuestionResponse[]> {
    const numberOfQuestions = prompt.numberOfQuestions ?? 10;
    const difficulty = prompt.difficulty ?? "easy";
    const topic = prompt.topic?.trim();

    if (!topic || topic.length < 3) {
      throw new Error("Topic must be a non-empty string with at least 3 characters.");
    }

    if (numberOfQuestions <= 0 || numberOfQuestions > 100) {
      throw new Error("Number of questions must be between 1 and 100.");
    }

    try {
      const promptText = `You are a JSON API that returns an array of multiple-choice questions. Generate exactly ${numberOfQuestions} questions on the topic "${topic}" with "${difficulty}" difficulty.

Output requirements (must be followed exactly):
- Respond ONLY with a valid JSON array (no markdown, no explanation, no surrounding text).
- Each array element must be a JSON object with these exact keys:
  "id", "question", "options", "correctAnswer", and "points".
- "id" must be a unique number or string.
- "question" must be a clear, human-readable question string.
- "options" must be an array of exactly 4 human-readable strings.
- "correctAnswer" must be a number from 0 to 3 indicating the index of the correct option.
- "points" must be a positive integer value representing the score for that question.
- Do NOT include any extra keys or text outside the JSON array.
- Ensure the final output is valid, parsable JSON (no trailing commas, no comments).
- Example format (do not include this example in the output):
  [
    { "id": 1, "question": "What is the capital of France?", "options": ["London", "Berlin", "Paris", "Madrid"], "correctAnswer": 2, "points": 10 }
  ]

Generate the questions now and return only the JSON array.`;


      const result = await textGeneratingModel.generateContent([promptText]);

      let rawText = result.response?.text?.();
      if (!rawText) {
        throw new Error("Empty response from the model.");
      }

      // 🔧 Clean output: remove markdown, comments, etc.
      rawText = rawText.trim();

      // Remove wrapping markdown code fences like ```json ... ```
      if (rawText.startsWith("```")) {
        rawText = rawText.replace(/^```[a-zA-Z]*\s*([\s\S]*?)\s*```$/, "$1").trim();
      }

      // Ensure it starts with [ and ends with ]
      const jsonStart = rawText.indexOf("[");
      const jsonEnd = rawText.lastIndexOf("]");
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("No JSON array found in model response.");
      }

      const jsonSlice = rawText.slice(jsonStart, jsonEnd + 1);

      let parsed: unknown;
      try {
        parsed = JSON.parse(jsonSlice);
      } catch (jsonError) {
        console.error("Failed to parse cleaned JSON:", jsonSlice);
        throw new Error("Model response could not be parsed as JSON.");
      }

      if (!Array.isArray(parsed)) {
        throw new Error("Model response is not a JSON array.");
      }

      const items = parsed as any[];
      const validated: QuestionResponse[] = items
        .map((q, idx) => {
          if (
            typeof q?.question === "string" &&
            Array.isArray(q?.options) &&
            q.options.length === 4 &&
            q.options.every((opt: any) => typeof opt === "string") &&
            typeof q.correctAnswer === "number" &&
            q.correctAnswer >= 0 &&
            q.correctAnswer < 4 &&
            Number.isInteger(q.points) &&
            q.points > 0
          ) {
            return {
              id: q.id ?? idx + 1,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              points: q.points,
            } as QuestionResponse;
          }
          return null;
        })
        .filter((x): x is QuestionResponse => x !== null);

      if (validated.length !== numberOfQuestions) {
        throw new Error(`Expected ${numberOfQuestions} questions, but received ${validated.length}.`);
      }

      return validated;
    } catch (error: any) {
      console.error("Quiz generation failed:", error);
      throw new Error(error.message || "Unknown error occurred during quiz generation.");
    }
  }

  async generateMainData(roomId: string, prompt: QuizPrompt): Promise<void> {
    const key = `room:${roomId}`;
    try {
      const mainData = await this.modelGemini2Flash(prompt);
      // save the generated data to Redis or database
      const existingData = await this.redis.client.get(key);
      if (!existingData) {
        throw new Error("Room data not found in Redis.");
      }
      const updatedData = existingData ? JSON.parse(existingData) : {} as RoomSession;
      updatedData.questions = mainData;
      await this.redis.client.set(key, JSON.stringify(updatedData));
    } catch (error) {
      await this.redis.client.del(key);
    }
  }
}
