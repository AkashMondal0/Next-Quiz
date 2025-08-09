'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Counter from '@/components/quiz/Counter'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useQuizBattleForm } from '@/hooks/useQuizBattleForm'

export default function MatchSettingsForm({
  type,
  onSubmit,
  onBack,
}: {
  type: 'custom' | 'customRoom'
  onSubmit: (data: any) => void
  onBack: () => void
}) {
  const { register, errors, numberOfQuestions, participantLimit, setValue, handleSubmit, isSubmitting } =
    useQuizBattleForm()

  return (
    <Card className="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-lg text-left">
      <CardHeader>
        <CardTitle className="text-xl text-center text-white">
          {type === 'customRoom' ? 'Custom Room Settings' : 'Match Settings'}
        </CardTitle>
        <CardDescription className="text-center text-neutral-400">
          {type === 'customRoom'
            ? 'Create or join a private room'
            : 'Customize your quiz battle setup'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <Textarea
              {...register('topic', { required: 'Topic is required' })}
              placeholder="Enter topic"
              className="bg-neutral-900 border border-neutral-700 rounded-xl text-white"
            />
            {errors.topic && <p className="text-sm text-red-500">{errors.topic.message}</p>}
          </div>

          <Select
            onValueChange={(value: "easy" | "medium" | "hard") => setValue('difficulty', value)}
            defaultValue="easy"
          >
            <SelectTrigger className="rounded-xl bg-neutral-900 border border-neutral-700 text-white">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent className='bg-neutral-900 border border-neutral-700'>
              <SelectItem value="easy" className='text-white'>Easy</SelectItem>
              <SelectItem value="medium" className='text-white'>Medium</SelectItem>
              <SelectItem value="hard" className='text-white'>Hard</SelectItem>
            </SelectContent>
          </Select>

          <Counter
            label="Number of Questions"
            value={numberOfQuestions}
            min={5}
            max={50}
            increment={() => setValue('numberOfQuestions', Math.min(numberOfQuestions + 1, 50))}
            decrement={() => setValue('numberOfQuestions', Math.max(numberOfQuestions - 1, 5))}
          />

          <Counter
            label="Participant Limit"
            value={participantLimit}
            min={2}
            max={500}
            increment={() => setValue('participantLimit', Math.min(participantLimit + 1, 500))}
            decrement={() => setValue('participantLimit', Math.max(participantLimit - 1, 2))}
          />

          <div className="flex gap-4">
            <Button type="submit" className="w-full rounded-xl bg-green-600 hover:bg-green-700 transition text-white font-semibold" disabled={isSubmitting}>
              {type === 'customRoom' ? 'Create Room' : 'Create Match'}
            </Button>
            <Button type="button" variant="outline" className="w-full rounded-xl border border-neutral-500 text-neutral-100" onClick={onBack}>
              Back
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
