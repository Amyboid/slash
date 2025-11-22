"use client"

import { useEffect, useState } from "react";
type Params = {
  code: string;
};
export default function page({ params }: {params: Params}) {
  const { code } = params
  const [stats, setStats] = useState("");
  useEffect(() => {
    async function handleStats() {
      if (!code) {
        return;
      }
      fetch(`/api/links/${code}`);
    }
    handleStats()
  }, []);
}
