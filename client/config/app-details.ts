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
    appUrl: "http://localhost:3000",
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "",
});

export const event_name = Object.freeze(
    {
        event: {
            roomCreated: 'room_created',
            roomActivity: 'room_activity',
            roomEnded: 'room_ended',
        },
    }
)