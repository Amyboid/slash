"use client";
import Input from "@/components/Input";
import { useEffect, useState } from "react";

export default function Home() {
  const [inputs, setInputs] = useState<{
    targetUrl?: string;
    shortCode?: string;
  }>({ targetUrl: "", shortCode: "" });
  const [formError, setFormError] = useState("");
  const [toggleShortCode, setToggleShortCode] = useState(false);
  const [allUrls, setAllUrls] = useState([{}]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/links");
        const data = await res.json();
        console.log(data);
        setAllUrls(data);
      } catch (error) {
        console.log("error getting url", error);
      }
    };
    fetchData();
  }, []);
  function handleChange(e: any) {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    setInputs((values) => ({ ...values, [name]: value }));
  }
  async function handleSubmit(e: any): Promise<void> {
    let validationError = false;
    setFormError("");
    e.preventDefault();

    if (!toggleShortCode) {
      inputs.shortCode = "";
    }
    if (!validateUrl(inputs.targetUrl)) {
      setFormError((prev) => prev + "Invalid url ");
      validationError = true;
    }
    if (toggleShortCode) {
      if (!validateShortCode(inputs.shortCode)) {
        setFormError((prev) => prev + "Invalid shortcode");
        validationError = true;
      }
    }
    if (validationError) {
      return;
    }
    console.log(inputs, toggleShortCode);
    setInputs({ targetUrl: "", shortCode: "" });
    const payload = {
      targetUrl: inputs.targetUrl,
      shortCode: toggleShortCode ? inputs.shortCode : "",
    };
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log();

      if (data.success) {
        setAllUrls((prev) => [
          ...prev,
          { code: data.response.code, target: data.response.target },
        ]);
      } else {
      }
    } catch (error) {
      console.log("error creating url", error);
    }
  }
  async function handleDelete(code: string) {
    if (!code) {
      return;
    }

    console.log(code);
    
    let res = await fetch(`/api/links/${code}`, {
      method: "DELETE",
    });
    let data = await res.json()
    if(data.success){
      let updatedUrls = allUrls.filter((url:any) => url.code!= code)
      setAllUrls(updatedUrls)
    }
  }


  return (
    <div className="w-full h-screen flex flex-col items-center border gap-4">
      <form
        action=""
        method="post"
        className="sm:mt-40 mt-10 sm:w-[420px] w-[300px] h-[180px] p-3 rounded-lg bg-[#f2efef] flex flex-col justify-between"
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
          {toggleShortCode && (
            <>
              <Input
                name="shortCode"
                placeholder="type shortcode.."
                value={inputs.shortCode}
                handleChange={handleChange}
                required
              />
            </>
          )}
        </div>
        <div>
          {formError && <p className="text-xs text-red-700">{formError}</p>}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label htmlFor="toggleShortCode" className="text-xs">
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
              className="border rounded-lg p-2 px-3 ml-auto cursor-pointer"
            >
              Generate
            </button>
          </div>
        </div>
      </form>

      <div className="sm:w-[620px] w-[320px] h-auto border">
        {allUrls.length > 0 &&
          allUrls.map((url: any, key) => {
            return (
              <ul key={key}>
                <li>{url.code}</li>
                <li>
                  <a
                    href={`/${url.code}`}
                  >
                    {url.code}
                  </a>
                </li>
                <button onClick={() => handleDelete(url.code)}>delete</button>
                <button><a href={`/api/links/${url.code}`}>stats</a></button>
              </ul>
            );
          })}

      </div>
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
