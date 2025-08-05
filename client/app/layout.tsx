import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/provider/theme-provider'
import Redux_Provider from '@/provider/store-provider'
import Socket_Provider from '@/provider/socket-provider'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Quiz Battle',
  description: 'Set up your quiz battle with customizable parameters',
}

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Redux_Provider>
              <Socket_Provider>
                {children}
              </Socket_Provider>
            </Redux_Provider>
          </ThemeProvider>
           <Toaster />
        </body>
      </html>
    </>
  )
}
