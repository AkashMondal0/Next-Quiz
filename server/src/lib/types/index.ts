export enum Role {
    User = 'user',
    Admin = 'admin',
    Public = "public"
}

export type TemporaryUser = {
    username: string;
    id: string;
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
  matchDuration?: number;
};

export type QuizAnswerRequest = {
    answers: number[];
    userId: string | number | any;
    code: string;
    timeTaken: number;
}

export type RoomSessionActivityData = {
   type: "quiz_submit" | "quiz_answer" | "quiz_start" | "quiz_result_update" | "quiz_leave";
    members: (string | number)[];
    id: string | number | undefined;
    totalAnswered: number;
    code?: string;
    score: number;
}
