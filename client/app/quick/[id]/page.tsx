'use client';
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchRoomSession } from "@/store/features/account/Api";
import { use, useLayoutEffect } from "react";
import dynamic from "next/dynamic";

const QuickMatchPage = dynamic(() => import('@/components/Quick/QuickMatchPage'),{
  ssr: false,
});

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const roomSession = useAppSelector((state) => state.AccountState.roomSession);
  const dispatch = useAppDispatch()
  useLayoutEffect(() => {
    dispatch(fetchRoomSession(id))
  }, []);
  if (!roomSession || roomSession.code !== id) {
    return null;
  }
  return <QuickMatchPage roomSession={roomSession} />;
}