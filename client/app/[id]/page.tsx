'use client';
import LobbyPage from '@/components/Lobby/LobbyPage';
import { use } from 'react'
 
export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <LobbyPage id={id} />;
}