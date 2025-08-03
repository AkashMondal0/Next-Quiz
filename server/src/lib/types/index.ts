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
}

export type RoomSessionActivityData = {
    type: "quiz_submit" | "quiz_answer";
    members: string[];
    id: string | number | undefined;
    totalAnswered: number;
    code?: string;
    score: number;
}