"use client"

import React from "react";
import { useEffect, useState } from "react";

export default function page({ params }: any) {
  const { code } = React.use(params)
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
