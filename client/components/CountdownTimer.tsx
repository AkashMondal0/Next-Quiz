'use client'

import { useEffect, useState } from 'react'

type CountdownTimerProps = {
    duration: number // in seconds
    onComplete: () => void
}

const CountdownTimer = ({ duration, onComplete }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState(duration)

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete()
            return
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [timeLeft, onComplete])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    return (
        <div className="text-sm text-neutral-400 my-2">
            ⏳ Time Remaining: <span className="text-white font-bold">{formatTime(timeLeft)}</span>
        </div>
    )
}

export default CountdownTimer
