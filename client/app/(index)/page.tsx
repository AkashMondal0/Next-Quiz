'use client'

import React, { useEffect, useContext, useCallback, useState } from 'react'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useRouter } from 'next/navigation'
import { SocketContext } from '@/provider/socket-provider'
import dynamic from 'next/dynamic'
import { QuizBattleFormData } from '@/types/quizBattle'
import QuizGenerationLoader from '@/components/room/QuizGenerationLoader'
import { Loader2 } from 'lucide-react'
const Loading = () => <div className="flex justify-center items-center h-screen"><Loader2 className='animate-spin' /></div>;

const LoginComponent = dynamic(() => import('@/components/quiz/LoginComponent'), { ssr: false,
    loading: () => <Loading/>
 })
const SelectMatchComponent = dynamic(() => import('@/components/room/SelectMatchComponent'), { ssr: false,
    loading: () => <Loading/>
})

const Page = () => {
    const { disconnectSocket, connectSocket } = useContext(SocketContext)
    const session = useSelector((Root: RootState) => Root.AccountState.session)
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleCustomRoom = useCallback(async (formData: QuizBattleFormData = {
        topic: "General Knowledge",
        difficulty: "medium",
        numberOfQuestions: 2,
        participantLimit: 2
    }) => {
        if (!session || !session.id || !session.username) {
            toast.error('You must be logged in to start matchmaking.')
            return
        }
        try {
            setLoading(true)
            const response = await api.post('/room/custom', {
                user: {
                    id: session?.id,
                    username: session?.username,
                    avatar: ''
                },
                level: 1,
                roomSize: formData.participantLimit,
                prompt: formData
            })

            await new Promise(resolve => setTimeout(resolve, 1800))
            if (response.data.code) {
                router.push(`/quiz/room/${response.data.code}`)
            }
        } catch (error: any) {
            toast.error('Failed to start matchmaking. Please try again later.', {
                description: error?.response?.data?.message || 'An unexpected error occurred.'
            })
        }
    }, [connectSocket, session, router])

    const handleJoinCustomRoom = useCallback(async (input: string) => {
        if (!session || !session.id || !session.username) {
            toast.error('You must be logged in to join a custom room.')
            return
        }
        try {
            const res = await api.post(`/room/custom-join/${input}`, {
                user: {
                    id: session?.id,
                    username: session?.username,
                    avatar: ''
                },
            })
            if (res.data.code) {
                router.push(`/quiz/room/${res.data.code}`)
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to start matchmaking. Please try again later.', {
                description: error?.response?.data?.message || 'An unexpected error occurred.'
            })
        }
    }, [session, router])

    useEffect(() => {
        const handleBeforeUnload = () => {
            disconnectSocket()
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => {
            disconnectSocket()
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [])

    if (!session || !session.id || !session.username) {
        return (
            <LoginComponent />
        );
    }

    if (loading) {
        return <QuizGenerationLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black">
            <SelectMatchComponent
                handleCustomRoom={handleCustomRoom}
                handleJoinCustomRoom={handleJoinCustomRoom}
            />
        </div>
    );
}

export default Page;