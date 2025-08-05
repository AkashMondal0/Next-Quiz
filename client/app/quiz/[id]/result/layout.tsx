import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Quiz Battle Result',
    description: 'View the results of your quiz battle',
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
