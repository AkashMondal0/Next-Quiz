// const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI } from "@google/generative-ai";
import configuration from "../configs/configuration";
const apiKey = configuration().GEN_AI_API_KEY;
if (!apiKey) {
	throw new Error("GEN_AI_API_KEY is not defined in the environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey);
// const imageGeneratingModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp-image-generation" });
const textGeneratingModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generationImageConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 40,
	maxOutputTokens: 8192,
	responseModalities: ['image', 'text'],
	responseMimeType: 'text/plain',
};

const generationTextConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 40,
	maxOutputTokens: 8192,
	responseModalities: [
	],
	responseMimeType: "text/plain",
};

export {
	// imageGeneratingModel,
	textGeneratingModel,
	generationImageConfig,
	generationTextConfig,
	genAI,
}