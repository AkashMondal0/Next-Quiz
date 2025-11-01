'use client';
import QuickMatchPage from "@/components/Quick/QuickMatchPage";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchRoomSession } from "@/store/features/account/Api";
import { use, useLayoutEffect } from "react";

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