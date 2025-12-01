"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();
  async function handleLogout(): Promise<void> {
    const res = await (await fetch("api/auth/logout")).json();
    if (res.loggedOut) {
      router.push("/login");
    }
  }

  return (
    <button className="bg-[#d4d4d4] cursor-pointer p-3 rounded-full border hover:shadow-[3px_2px_rgb(0,0,0)] shadow-[4px_2.5px_rgb(0,0,0)]" onClick={handleLogout}>
      <LogOut size={20}/>
    </button>
  );
}
