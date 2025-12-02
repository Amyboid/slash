"use client";
import Input from "@/components/ui/Input";
import { useEffect, useState } from "react";
import Button from "./ui/Button";
import SpinLoader from "./ui/SpinLoader";
import { useDebounce } from "@/lib/debounce";
import { useRouter } from "next/navigation";

type FormProps = {
  setShowCreateForm: Function;
  setAllUrls: Function;
};

export default function AddUrlForm({
  setAllUrls,
  setShowCreateForm,
}: FormProps) {
  const [inputs, setInputs] = useState<{
    targetUrl?: string;
    shortCode?: string;
  }>({ targetUrl: "", shortCode: "" });
  const [formError, setFormError] = useState("");
  const [targetUrlError, setTargetUrlError] = useState("");
  const [shortcodeError, setShortcodeError] = useState("");
  const [toggleShortCode, setToggleShortCode] = useState(false);
  const debouncedQuery = useDebounce(inputs, 600);
  const router = useRouter()
  useEffect(() => {
    if (
      debouncedQuery.shortCode &&
      !validateShortCode(debouncedQuery.shortCode)
    ) {
      setShortcodeError("Invalid shortcode (length 6-8)");
    } else {
      setShortcodeError("");
    }
  }, [debouncedQuery.shortCode]);

  useEffect(() => {
    if (debouncedQuery.targetUrl && !validateUrl(debouncedQuery.targetUrl)) {
      setTargetUrlError("Invalid url");
    } else {
      setTargetUrlError("");
    }
  }, [debouncedQuery.targetUrl]);

  const [showLoder, setShowLoder] = useState(false);
  function handleChange(e: any) {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    setInputs((values) => ({ ...values, [name]: value }));
  }
  async function handleSubmit(e: any): Promise<void> {
    setFormError("");
    e.preventDefault();

    if (!toggleShortCode) {
      inputs.shortCode = "";
    }

    if (shortcodeError || targetUrlError) {
      return;
    }
    console.log(inputs, toggleShortCode);
    setInputs({ targetUrl: "", shortCode: "" });
    const payload = {
      targetUrl: inputs.targetUrl,
      shortCode: toggleShortCode ? inputs.shortCode : "",
    };
    try {
      setShowLoder(true);
      const res = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log(data);

      if (data.status === 200) {
        setAllUrls((prev: any) => [
          ...prev,
          { code: data.response.code, target: data.response.target },
        ]);
        setShowLoder(false);
        setShowCreateForm(false);
      }
      else if(data.status === 500){
        setFormError(data.msg)
        setTimeout(()=>{
          setShowLoder(false);
          router.push("/login")
        }, 2000)
      }
      else {
        setShowLoder(false);
        setFormError(data.msg);
      }
    } catch (error) {
      setShowLoder(false);
      setFormError(error as string);
      console.log("error creating url", error);
    }
  }
  return (
    <div className="border w-full h-[60vh] absolute left-0 top-0 bg-[#1cceaad6] backdrop-blur-3xl flex items-center justify-center p-6">
      <button
        onClick={() => setShowCreateForm(false)}
        className="absolute top-5 right-5 bg-[#d4d4d4] cursor-pointer rounded-full border hover:shadow-[3px_2px_rgb(0,0,0)] shadow-[4px_2.5px_rgb(0,0,0)] w-11 h-11 font-bold"
      >
        X
      </button>
      <form
        action=""
        method="post"
        className="w-full max-w-md h-[250px] p-5 rounded border-2 shadow-[4px_4px_rgb(0,0,0)] bg-amber-300 flex flex-col justify-between"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col gap-2">
          <Input
            name="targetUrl"
            placeholder="type long url..."
            value={inputs.targetUrl}
            handleChange={handleChange}
            required
          />
          <span className="text-red-600 text-xs">{targetUrlError}</span>
          {toggleShortCode && (
            <>
              <Input
                name="shortCode"
                placeholder="type shortcode.."
                value={inputs.shortCode}
                handleChange={handleChange}
                required
              />
              <span className="text-red-600 text-xs">{shortcodeError}</span>
            </>
          )}
        </div>
        <div>
          {formError && <p className="text-xs text-red-600">{formError}</p>}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label
                htmlFor="toggleShortCode"
                className="text-xs sm:text-sm font-bold"
              >
                Use custom shortcode
              </label>
              <input
                type="checkbox"
                name="toggleShortCode"
                checked={toggleShortCode}
                onChange={(e) => setToggleShortCode(e.target.checked)}
              />
            </div>

            <button
              type="submit"
              className="p-2 px-4 border-2 shadow-[4px_4px_rgb(0,0,0)] hover:shadow-[3px_3px_rgb(0,0,0)] bg-[#1cceab] transition-all ml-auto rounded cursor-pointer"
            >
              {!showLoder && <p>Generate</p>}
              {showLoder && (
                <div className="flex justify-center">
                  <SpinLoader size={20} />
                </div>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function validateUrl(targetUrl: string | undefined): boolean {
  if (!targetUrl) return false;
  try {
    new URL(targetUrl);
    return true;
  } catch (error) {
    return false;
  }
}

function validateShortCode(shortCode: string | undefined): boolean {
  if (!shortCode) return false;
  let code = /^[A-Za-z0-9]{6,8}$/;
  return code.test(shortCode);
}
