'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAxios } from '@/lib/useAxios'
import { RoomSession } from '@/types'
import { useDispatch } from 'react-redux'
import { setRoomSession } from '@/store/features/room/RoomSlice'
import dynamic from 'next/dynamic'
import { useDebounce } from '@/lib/useDebounce'

const MatchScreen = dynamic(() => import('@/components/quiz/MatchScreen'))
const BattleRoomLoadingScreen = dynamic(() => import('@/components/quiz/BattleRoomLoadingScreen'))

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
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 flex-col">
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

  if(error) {
     return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 flex-col">
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
    <div className="relative w-full h-full">
      {Array.isArray(data?.players) && data.players.length > 0 && (
        <BattleRoomLoadingScreen
          players={data.players}
          triggerStartMatch={triggerStartMatch}
        />
      )}
    </div>
  )
}

export default Page
