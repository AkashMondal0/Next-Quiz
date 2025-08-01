'use client'

import React, { useEffect, useState } from 'react'
import { useAxios } from '@/lib/useAxios'
import { RoomSession, TemporaryUser } from '@/types'
import { useDispatch } from 'react-redux'
import { setRoomSession } from '@/store/features/room/RoomSlice'
import MatchScreen from '@/components/quiz/MatchScreen'
import BattleRoomLoadingScreen from '@/components/quiz/BattleRoomLoadingScreen'

const Page = ({
    params: { id }
}: {
    params: {
        id: string
    }
}) => {
    const dispatch = useDispatch()
    const { data, loading ,refetch} = useAxios<RoomSession>({
        url: `/room/${id}`,
        method: 'get',
    })
    const [matchStarted, setMatchStarted] = useState(false)

    const triggerStartMatch = () => {
        refetch();
        setMatchStarted(true)
    }

    useEffect(() => {
        if (data) {
            dispatch(setRoomSession(data));
        }
    }, [data]);

    if (matchStarted) {
        return <MatchScreen data={data} />;
    }

    return (
        <div className="relative w-full h-full">
            {Array.isArray(data?.players) && data.players.length > 0 ? (
                <BattleRoomLoadingScreen
                    players={data.players}
                    triggerStartMatch={triggerStartMatch}
                />
            ) : (
                <></>
            )}
        </div>
    )
}

export default Page;
