import 'dotenv/config';
export default () => ({
    REDIS_URL: process.env.REDIS_URL,
    // google gen ai api key -- > https://ai.google.dev/gemini-api/docs
    GEN_AI_API_KEY: process.env.GEN_AI_API_KEY,
});