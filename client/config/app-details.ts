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
});