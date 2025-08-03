'use client';

import { RoomSession } from "@/types";
import { useAxios } from "@/lib/useAxios";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  params: { id: string };
};

export default function QuizResultPage({ params }: Props): JSX.Element {
  const { id } = params;
  const { data, loading } = useAxios<RoomSession>({
    url: `/room/${id}`,
    method: "get",
  });

  if (loading || !data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Skeleton className="w-2/3 h-10 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 mb-4 rounded-xl" />
        ))}
      </div>
    );
  }

  const playerMap = Object.fromEntries(data.players.map((p) => [p.id, p]));
  const resultMap = Object.fromEntries(data.matchResults.map((r) => [r.id, r]));

  const rankedPlayers = [...data.players].sort(
    (a, b) => (resultMap[b.id]?.userMarks ?? 0) - (resultMap[a.id]?.userMarks ?? 0)
  );

  const getRankLabel = (index: number) => {
    switch (index) {
      case 0:
        return { label: "🥇 1st Place", color: "bg-yellow-100 text-yellow-800" };
      case 1:
        return { label: "🥈 2nd Place", color: "bg-gray-200 text-gray-800" };
      case 2:
        return { label: "🥉 3rd Place", color: "bg-orange-100 text-orange-800" };
      default:
        return { label: `#${index + 1}`, color: "bg-muted text-muted-foreground" };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Quiz Results</h1>
        <p className="text-muted-foreground text-sm">
          Room: <span className="font-medium">{data.code}</span>
        </p>
      </div>

      {/* Player Rankings */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Players</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankedPlayers.map((player, index) => {
            const rank = getRankLabel(index);
            const marks = resultMap[player.id]?.userMarks ?? 0;

            return (
              <Card key={player.id} className="w-full">
                <CardContent className="flex items-center gap-4 p-5">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback>{player.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{player.username}</h3>
                      {String(player.id) === String(data.hostId) && (
                        <Badge variant="secondary" className="text-xs">
                          Host
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-green-600 mt-1 font-medium">
                      Score: {marks} / {data.main_data.length}
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

      {/* Questions with Player Answers */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Questions</h2>
        <div className="space-y-6">
          {data.main_data.map((q, qIndex) => (
            <Card key={qIndex}>
              <CardContent className="p-5 space-y-2">
                <p className="text-base font-medium text-gray-800 dark:text-gray-100">
                  Q{qIndex + 1}: {q.text}
                </p>
                <ul className="space-y-1 text-sm">
                  {q.options.map((opt, i) => (
                    <li
                      key={i}
                      className={`px-3 py-1 rounded-md ${i === q.correctIndex
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-medium"
                        : "text-muted-foreground"
                        }`}
                    >
                      {opt} {i === q.correctIndex && "✅"}
                    </li>
                  ))}
                </ul>

                {/* Each Player's Answer for This Question */}
                <div className="mt-4 space-y-2">
                  {data.matchResults.map((res) => {
                    const player = playerMap[res.id];
                    const answerIndex = res.userAnswers?.[qIndex];
                    const selected = answerIndex !== undefined ? q.options[answerIndex] : null;
                    const correct = answerIndex === q.correctIndex;

                    return (
                      <div key={res.id} className="flex items-center gap-2 text-sm">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{player.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{player.username}</span>
                        <span
                          className={`ml-2 px-2 py-0.5 rounded ${answerIndex === undefined
                            ? "bg-gray-200 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300"
                            : correct
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                            }`}
                        >
                          {answerIndex === undefined
                            ? "No Answer ❌"
                            : `${selected} ${correct ? "✅" : "❌"}`}
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

      <footer className="pt-10 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} NextQuiz. All rights reserved.
      </footer>
    </div>
  );
}
