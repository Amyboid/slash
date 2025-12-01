import React from "react";
import Logout from "./Logout";

export default function Profile({
  user,
  className,
}: {
  user: string;
  className?: string;
}) {
  return (
    <div
      className={`w-full flex justify-between items-center gap-4  ${className}`}
    >
      <p className="font-bold text-lg sm:text-xl">Hello {user}!</p>
      <Logout />
    </div>
  );
}
