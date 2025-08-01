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