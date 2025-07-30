'use client'
import { store } from '@/store'
import React from 'react'
import { Provider } from 'react-redux'
const Redux_Provider = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

export default Redux_Provider
