'use client'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { setSession } from '@/store/features/account/AccountSlice'
import { TemporaryUser } from '@/types'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const Auth_Provider = () => {
    const dispatch = useDispatch()
    const [localData] = useLocalStorage<TemporaryUser>("username", {
        id: Math.floor(1000 + Math.random() * 9000),
        username: new Array(8).fill(null).map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join(''),
        avatar: "",
    });

    useEffect(() => {
        if (localData.username) {
            dispatch(setSession({
                id: localData.id, // Simulating a user ID
                username: localData.username,
                email: "email@example.com",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            } as any))
        }
    }, [localData.username]);

    return (
       <></>
    )
}

export default Auth_Provider
