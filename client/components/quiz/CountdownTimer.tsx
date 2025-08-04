'use client'
import { useEffect, useRef, useState, memo, useImperativeHandle, forwardRef } from 'react'

type CountdownTimerProps = {
    duration: number // total quiz time in seconds
    onExpire?: () => void
}

export type CountdownTimerRef = {
    getTimeTaken: () => number
}

const CountdownTimer = forwardRef<CountdownTimerRef, CountdownTimerProps>(
    ({ duration, onExpire }, ref) => {
        const [remaining, setRemaining] = useState(duration)
        const intervalRef = useRef<NodeJS.Timeout | null>(null)
        const startTimeRef = useRef(Date.now())

        useEffect(() => {
            intervalRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
                const left = duration - elapsed
                if (left <= 0) {
                    setRemaining(0)
                    clearInterval(intervalRef.current!)
                    onExpire?.()
                } else {
                    setRemaining(left)
                }
            }, 1000)

            return () => clearInterval(intervalRef.current!)
        }, [duration, onExpire])

        useImperativeHandle(ref, () => ({
            getTimeTaken: () => Math.floor((Date.now() - startTimeRef.current) / 1000),
        }))

        return (
            <div className="text-sm text-neutral-400">
                ⏱️ Time Left: {remaining}s
            </div>
        )
    }
)

export default memo(CountdownTimer)
