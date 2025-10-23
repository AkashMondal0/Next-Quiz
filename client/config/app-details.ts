export const appInfo = Object.freeze({
    title: "Fun Quiz",
    description: "An engaging quiz application that allows users to create, participate in, and manage quizzes.",
    icon: "app-details-icon",
    url: "/app-details",
    keywords: [
        "fun",
        "quiz",
        "engaging",
        "application"
    ],
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000",
    supabaseBucket: process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "https://your_supabase_project_url.supabase.co/storage/v1/object/public/next-stream",
    appUrl: "http://localhost:3000",
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "",
});