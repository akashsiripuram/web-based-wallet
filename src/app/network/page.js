"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Page() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNetworkSelection = (network) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("network", network);
      router.push("/key-pairs");
    }
  };

  if (!isMounted) return null; 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans">
      <button
        className="cursor-pointer px-4 py-2 bg-white text-black rounded-2xl w-[200px] mb-4"
        onClick={() => handleNetworkSelection("solana")}
      >
        Solana
      </button>
      <button
        className="cursor-pointer px-4 py-2 bg-white text-black rounded-2xl w-[200px] mb-4"
        onClick={() => handleNetworkSelection("eth")}
      >
        Ethereum
      </button>
    </div>
  );
}

export default Page;
