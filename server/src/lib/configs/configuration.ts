export default () => ({
    // Database
    PG_URL: process.env.PG_URL,
    REDIS_URL: process.env.REDIS_URL,
    // google gen ai api key -- > https://ai.google.dev/gemini-api/docs
    GEN_AI_API_KEY: process.env.GEN_AI_API_KEY,
    /// JWT
    JWT_SECRET: process.env.JWT_SECRET,
    /// Cookie
    COOKIE_NAME: "sky-inc-token",
    /// Supabase
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    // File upload
    HOST_BASE_PATH: process.env.HOST_BASE_PATH, //example: c:/ or /home/ubuntu/
    // App
    HOST_URL: process.env.HOST_URL, //example: http://localhost:3000 or https://yourdomain.com
    CLIENT_URL: process.env.CLIENT_URL, //example: http://localhost:5173 or https://yourdomain.com
    // OAuth
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
});