'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAxios } from '@/lib/useAxios'
import { RoomSession } from '@/types'
import { useDispatch } from 'react-redux'
import { setRoomSession } from '@/store/features/room/RoomSlice'
import dynamic from 'next/dynamic'
import { useDebounce } from '@/lib/useDebounce'
import { Loader2 } from 'lucide-react'
const Loading = () => <div className="flex justify-center items-center h-screen"><Loader2 className='animate-spin' /></div>;

const MatchScreen = dynamic(() => import('@/components/quiz/QuizMatchComponent'),{
  loading: () => <Loading />,
  ssr: false
})
const BattleRoomLoadingScreen = dynamic(() => import('@/components/quiz/BattleRoomLoadingScreen'), {
  loading: () => <Loading />,
  ssr: false
})

type PageProps = {
  params: {
    id: string
  }
}

const Page = ({ params: { id } }: PageProps) => {
  const dispatch = useDispatch()
  const { data, error, refetch } = useAxios<RoomSession>({
    url: `/room/${id}`,
    method: 'get',
  })

  const [matchStarted, setMatchStarted] = useState(false)

  const triggerStartMatch = useCallback(() => {
    setMatchStarted(true)
    refetch()
  }, [refetch])

  // Debounce the refetch to avoid too many requests
  const debouncedRefetch = useDebounce(refetch, 2000)

  useEffect(() => {
    if (data) {
      dispatch(setRoomSession(data))

      if (data?.main_data?.length <= 0) {
        debouncedRefetch()
      }
    }
  }, [data, debouncedRefetch])

  if (data?.matchEnded) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black text-white">
        <h1 className="text-4xl font-extrabold tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] mb-2">
          Match Ended
        </h1>
        <p className="text-xl text-neutral-300 font-medium">
          Thank you for playing!
        </p>
      </div>
    )
  }

  if (matchStarted && data && !data?.matchEnded) {
    return <MatchScreen data={data} />
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black text-white">
        <h1 className="text-4xl font-extrabold tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] mb-2">
          Error
        </h1>
        <p className="text-xl text-neutral-300 font-medium">
          Unable to load the room session. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black text-white">
      {Array.isArray(data?.players) ? (
        <BattleRoomLoadingScreen
          players={data.players}
          triggerStartMatch={triggerStartMatch}
        />
      ) : (
        <p>No players found.</p>
      )}
    </div>
  )
}

export default Page
