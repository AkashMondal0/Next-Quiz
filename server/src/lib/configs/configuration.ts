export default () => ({
    // Database
    PG_URL: process.env.PG_URL,
    REDIS_URL: process.env.REDIS_URL,
    // ai
    GEN_AI_API_KEY: process.env.GEN_AI_API_KEY,
    /// JWT
    JWT_SECRET: process.env.JWT_SECRET,
    /// Cookie
    COOKIE_NAME: "sky.inc-token",
});