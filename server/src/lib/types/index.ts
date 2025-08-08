export enum Role {
    User = 'user',
    Admin = 'admin',
    Public = "public"
}

export type TemporaryUser = {
    username: string;
    id: number;
    avatar: string;
}

export type QuestionResponse = {
  text: string;
  options: string[];
  correctIndex: number;
};

export type QuizPrompt = {
  topic: string;
  numberOfQuestions?: number;
  difficulty?: "easy" | "medium" | "hard";
};

export type quizAnswerRequest = {
    answers: number[];
    userId: string;
    duration: number;
    code: string;
    timeTaken: number;
}

export type RoomSessionActivityData = {
    type: "quiz_submit" | "quiz_answer" | "quiz_result_update";
    members: (string | number)[];
    id: string | number | undefined;
    totalAnswered: number;
    code?: string;
    score: number;
}