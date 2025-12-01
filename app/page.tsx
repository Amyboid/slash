"use client";
import AddUrlForm from "@/components/AddUrlForm";
import Logout from "@/components/Logout";
import Profile from "@/components/Profile";
import Button from "@/components/ui/Button";
import SpinLoader from "@/components/ui/SpinLoader";
import UrlCard from "@/components/UrlCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [hostname, setHostname] = useState("");
  const [showLoder, setShowLoder] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [allUrls, setAllUrls] = useState([{}]);
  const [user, setUser] = useState("");

  const fetchData = async () => {
    setShowLoder(true);
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      console.log(data);
      setAllUrls(data);
      setShowLoder(false);
    } catch (error) {
      console.log("error getting url", error);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const user = await res.json();
        console.log(user);

        if (!user.loggedIn) {
          router.push("/login");
        } else {
          setUser(user.username);
          fetchData();
        }
      } catch (error) {}
    })();
    setHostname(window.location.hostname);
  }, []);

  async function handleDelete(code: string) {
    if (!code) {
      return;
    }

    console.log(code);

    let res = await fetch(`/api/links/${code}`, {
      method: "DELETE",
    });
    let data = await res.json();
    console.log(data);

    if (data.success) {
      let updatedUrls = allUrls.filter((url: any) => url.code != code);
      setAllUrls(updatedUrls);
    }
  }

  function handleCreateForm(): void {
    setShowCreateForm(true);
  }

  return (
    <>
      {user && (
        <div className="min-w-[300px] md:w-5xl w-full h-screen overflow-x-scroll m-0 flex flex-col gap-8 py-6 sm:px-12 px-6 justify-between">
          <Profile user={user} />
          <div className="flex flex-col h-[80%] justify-between sm:gap-6">
            <Button
              handleClick={handleCreateForm}
              title="Create"
              className="ml-auto"
            />
            <>
              {showCreateForm && (
                <AddUrlForm
                  setShowCreateForm={setShowCreateForm}
                  setAllUrls={setAllUrls}
                />
              )}

              <div className="w-full sm:h-[450px] h-[88%] p-4 flex flex-col items-center border-4 justify-center gap-2 rounded">
                {showLoder && <SpinLoader />}
                {!showLoder && allUrls.length > 0 && (
                  <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-0 h-full overflow-scroll">
                    {allUrls.map((url: any, key) => {
                      return (
                        <UrlCard
                          key={key}
                          code={url.code}
                          hostname={hostname}
                          redirectUrl={url.target}
                          handleDelete={handleDelete}
                        />
                      );
                    })}
                  </div>
                )}
                {allUrls.length === 0 && (
                  <p className="text-center font-bold text-xl">No url is here</p>
                )}
              </div>
            </>
          </div>
        </div>
      )}
    </>
  );
}
