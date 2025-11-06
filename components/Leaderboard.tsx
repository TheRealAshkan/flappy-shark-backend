"use client";

import { useEffect, useState } from "react";

interface Player {
  username: string;
  score: number;
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-10 text-lg">LOADING...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        FLAPPYSHARK LEADERBOARD
      </h1>

      {players.length === 0 ? (
        <p className="text-center text-gray-500">EMPTY LEADERBOARD</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 text-left">NO.</th>
              <th className="py-2 px-4 text-left">NICKNAME</th>
              <th className="py-2 px-4 text-left">SCORE</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.username} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{player.username}</td>
                <td className="py-2 px-4 font-semibold">{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
