import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Quiz Battle Arena',
    description: 'Join the ultimate quiz battle and test your knowledge against others',
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
