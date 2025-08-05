import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Quiz Battle Setup',
    description: 'Set up your quiz battle with customizable parameters',
}

export default function RootLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
        </>
    )
}
