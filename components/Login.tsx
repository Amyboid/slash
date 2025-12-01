"use client";

import { useEffect, useState } from "react";
import Input from "./ui/Input";
import Toast from "./ui/Toast";
import { useRouter } from "next/navigation";
import SpinLoader from "./ui/SpinLoader";
import Button from "./ui/Button";

export default function Login() {
  const router = useRouter();
  const [showLoder, setShowLoder] = useState(false);
  const [inputs, setInputs] = useState({
    username: "aaaa",
    password: "a1",
  });
  const [formError, setFormError] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  function handleChange(e: any) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const user = await res.json();
        if (user.loggedIn) router.push("/");
      } catch (err) {}
    })();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setFormError("");
    const payload = { ...inputs };

    try {
      setShowLoder(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setTimeout(() => {
        setShowLoder(false);
      }, 1000);

      if (!data.loggedIn) return setFormError(data.error);
      router.push("/");
    } catch (error) {
      console.log("error logging in", error);
    }
  }

  return (
    <div className="w-full flex justify-center items-center min-h-screen p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1cceab] rounded p-6 w-full max-w-md space-y-4 relative border-2 shadow-[4px_4px_#000]"
      >
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Login
        </h1>
        <Input
          label="Username"
          type="text"
          name="username"
          value={inputs.username}
          handleChange={handleChange}
          placeholder="Enter username"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={inputs.password}
          handleChange={handleChange}
          placeholder="Enter password"
        />

        {formError && (
          <p className="text-sm text-red-600 p-2 rounded">{formError}</p>
        )}

        <div className="flex flex-col gap-2">
          <button
            className="p-2 px-4 border-2 shadow-[4px_4px_rgb(0,0,0)] hover:shadow-[3px_3px_rgb(0,0,0)] bg-amber-300 transition-all cursor-pointer rounded"
            type="submit"
          >
            {!showLoder && <p>Login</p>}
            {showLoder && (
              <div className="flex justify-center">
                <SpinLoader size={24}/>
              </div>
            )}
          </button>
        </div>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-gray-700 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
