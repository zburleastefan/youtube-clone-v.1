'use client'
import { AuthContextProvider } from '@/context/AuthContext';
import NavBar from './components/NavBar';
import './globals.css';
import Head from './head';
import Notification from './components/Notification';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className='bg-black'>
      <Head/>
      <body className='h-screen overflow-y-auto overflow-x-hidden w-screen'>
        <AuthContextProvider>
          <NavBar/>
          <div className='flex flex-col '>
            <Notification/>

            <div className="flex-1">{children}</div>
          </div>
        </AuthContextProvider>
      </body>
    </html>
  )
}