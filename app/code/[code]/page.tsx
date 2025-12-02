"use client";

import React from "react";
import { useEffect, useState } from "react";

type Stats = {
  code: string;
  target: string;
  clicked: number;
  last_clicked: string;
  user_id: number | "none";
};

export default function page({ params }: { params: any }) {
  const param = React.use<any>(params);
  const code = param.code;
  const [stats, setStats] = useState<Stats>({
    code: "",
    target: "",
    clicked: 0,
    last_clicked: "none",
    user_id: "none",
  });
  useEffect(() => {
    async function handleStats() {
      if (!code) {
        return;
      }
      let res = fetch(`/api/links/${code}`);
      const data = (await (await res).json())[0];
      console.log(data, typeof data);
      setStats(data);
    }
    handleStats();
  }, []);

  return (
    <div className="w-full h-screen bg-[#1cceab] flex items-center justify-center p-6">
      <div className="bg-amber-300 border-2 shadow-[3px_3px_#000] w-full sm:w-[450px] rounded relative p-4 flex flex-col gap-2">
        <p className="h-8 sm:h-10 bg-red-400 p-1 sm:p-2 px-4 sm:px-6 absolute -top-8 sm:-top-10 left-0 rounded-t border-2 font-bold text-center">
          Stats
        </p>
        {Object.entries(stats).map(([key, val], k) => (
          <p key={k} className="font-bold w-full flex gap-2">
            <span className="text-xs p-1 px-2 h-7 border-2 rounded bg-red-400">
              {key}
            </span>
            <span className="w-full overflow-y-auto">{val || "none"}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
