'use client';

import { RoomSession } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import React, { useMemo } from "react";

type Props = {
  data: RoomSession;
};

export default function QuizResultContent({ data }: Props) {
  const playerMap = useMemo(
    () => Object.fromEntries(data.players.map((p) => [p.id, p])),
    [data]
  );
  const resultMap = useMemo(
    () => Object.fromEntries(data.matchResults.map((r) => [r.id, r])),
    [data]
  );

  const rankedPlayers = useMemo(() => {
    return [...data.players].sort((a, b) => {
      const resA = resultMap[a.id];
      const resB = resultMap[b.id];
      if (!resA || !resB) return 0;
      if (resB.userMarks !== resA.userMarks) return resB.userMarks - resA.userMarks;
      return resA.timeTaken - resB.timeTaken;
    });
  }, [data, resultMap]);

  const getRankLabel = (index: number) => {
    switch (index) {
      case 0: return { label: "🥇 1st Place", color: "bg-yellow-100 text-yellow-800" };
      case 1: return { label: "🥈 2nd Place", color: "bg-gray-200 text-gray-800" };
      case 2: return { label: "🥉 3rd Place", color: "bg-orange-100 text-orange-800" };
      default: return { label: `#${index + 1}`, color: "bg-muted text-muted-foreground" };
    }
  };

  return (
    <>
      {/* Player Rankings */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Players</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankedPlayers.map((player, index) => {
            const rank = getRankLabel(index);
            const marks = resultMap[player.id]?.userMarks ?? 0;
            const timeTaken = resultMap[player.id]?.timeTaken ?? 0;
            const accuracy = marks / data.main_data.length * 100;
            const submitted = data?.matchRanking?.find((r) => r.id === player.id)?.isSubmitted ?? false;
            return (
              <Card key={player.id}>
                <CardContent className="flex items-center gap-4 p-5">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback>{player.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{player.username}</h3>
                      {String(player.id) === String(data.hostId) && (
                        <Badge variant="secondary" className="text-xs">Host</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={`text-xs ${submitted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >{submitted?"Submitted":"Not Submitted"}</Badge>
                    </div>
                    <p className="text-sm text-green-600 mt-1 font-medium">
                      Score: {marks} / {data.main_data.length}
                    </p>
                    <p className="text-sm text-blue-600">
                      Accuracy: {accuracy.toFixed(2)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Time Taken: {timeTaken} sec
                    </p>
                    <div className={`mt-2 px-2 py-1 rounded text-xs font-semibold w-fit ${rank.color}`}>
                      {rank.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Questions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Questions</h2>
        <div className="space-y-6">
          {data.main_data.map((q, qIndex) => (
            <Card key={qIndex}>
              <CardContent className="p-5 space-y-2">
                <p className="text-base font-medium">
                  Q{qIndex + 1}: {q.text}
                </p>
                <ul className="space-y-1 text-sm">
                  {q.options.map((opt, i) => (
                    <li
                      key={i}
                      className={`px-3 py-1 rounded-md ${i === q.correctIndex
                        ? "bg-green-100 text-green-800 font-medium"
                        : "text-muted-foreground"}`}
                    >
                      {opt} {i === q.correctIndex && "✅"}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 space-y-2">
                  {data.matchResults.map((res) => {
                    const player = playerMap[res.id];
                    if (!player) return null;
                    const answerIndex = res.userAnswers?.[qIndex];
                    const correct = answerIndex === q.correctIndex;
                    return (
                      <div key={`${res.id}-${qIndex}`} className="flex items-center gap-2 text-sm">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{player.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{player.username}</span>
                        <span
                          className={`ml-2 px-2 py-0.5 rounded ${
                            answerIndex === undefined
                              ? "bg-gray-200 text-gray-700"
                              : correct
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {answerIndex === undefined
                            ? "No Answer ❌"
                            : `${q.options[answerIndex]} ${correct ? "✅" : "❌"}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
