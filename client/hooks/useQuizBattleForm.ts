'use client'

import { useForm, Controller } from 'react-hook-form'
import { QuizBattleFormData } from '@/types'

export function useQuizBattleForm(initialValues?: Partial<QuizBattleFormData>) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuizBattleFormData>({
    defaultValues: {
      topic: 'JavaScript General Knowledge',
      difficulty: 'easy',
      numberOfQuestions: 10,
      participantLimit: 2,
      matchDuration: 600, // default to 10 minutes
      roomCode: '',
      ...initialValues,
    },
  })

  const numberOfQuestions = watch('numberOfQuestions')
  const participantLimit = watch('participantLimit')
  const matchDuration = watch('matchDuration')

  return {
    register,
    control,
    errors,
    handleSubmit,
    setValue,
    numberOfQuestions,
    participantLimit,
    matchDuration,
    watch,
    Controller, // exporting in case a component wants to use it directly
    isSubmitting,
  }
}
