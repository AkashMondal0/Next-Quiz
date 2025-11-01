'use client';
import { use } from 'react'
import dynamic from 'next/dynamic';

const LobbyPage = dynamic(() => import('@/components/Lobby/LobbyPage'), {
  ssr: false,
});

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <LobbyPage id={id} />;
}