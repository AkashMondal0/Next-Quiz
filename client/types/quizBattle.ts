export interface QuizBattleFormData {
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  numberOfQuestions: number
  participantLimit: number
  roomCode?: string
}
