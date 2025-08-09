'use client';

import { RoomSession, RoomSessionActivityData } from "@/types";
import { useAxios } from "@/lib/useAxios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SocketContext } from "@/provider/socket-provider";
import { event_name } from "@/config/app-details";
import React, { useContext, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useDebounce } from "@/lib/useDebounce";
const Loading = () => <div className="flex justify-center items-center h-screen"><Loader2 className='animate-spin' /></div>;

const QuizResultContent = dynamic(() => import("@/components/quiz/QuizResultContent"), {
  ssr: false,
  loading: () => <Loading />,
});

type Props = {
  params: { id: string };
};

export default function QuizResultPage({ params }: Props) {
  const { id } = params;
  const { socket, connectSocket } = useContext(SocketContext);

  const { data, refetch, error } = useAxios<RoomSession>({
    url: `/room/${id}`,
    method: "get",
  });

  const debouncedRefetch = useDebounce(refetch, 1000);

  useEffect(() => {
    connectSocket();
    socket?.on(event_name.event.roomActivity, (data: RoomSessionActivityData) => {
      if (data.type === "quiz_result_update" && data.code === id) {
        debouncedRefetch();
      }
    });
    return () => {
      socket?.off(event_name.event.roomActivity);
    };
  }, [socket, id, debouncedRefetch, connectSocket]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Header always loads instantly */}
      <div className="flex justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Quiz Results</h1>
          <p className="text-muted-foreground text-sm">
            Room: <span className="font-medium">{id}</span>
          </p>
        </div>
        <Link href="/" className="mt-4">
          <Button variant="secondary" size="sm">Back to Home</Button>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center text-red-500">
          Failed to load quiz results.
        </div>
      )}

      {/* Data Loaded */}
      {data ? <QuizResultContent data={data} /> : <></>}
    </div>
  );
}
