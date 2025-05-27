"use client";
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
function Page() {
  const [mnemonic, setMnemonic] = useState("");
  const [solKeys, setSolKeys] = useState([]);
  const [ethKeys, setEthKeys] = useState([]);
  const [network, setNetwork] = useState("");
  const [keyPairs, setKeyPairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if(typeof window !== "undefined"){
    const savedNetwork = localStorage.getItem("network") || "solana";
    const savedMnemonic = localStorage.getItem("recoveryPhrase") || "";
    const savedSol = JSON.parse(localStorage.getItem("solKeys") || "[]");
    const savedEth = JSON.parse(localStorage.getItem("ethKeys") || "[]");
    
    console.log("Saved Network:", savedSol);
    console.log("Saved Mnemonic:", savedEth);
    
    setNetwork(savedNetwork);
    setMnemonic(savedMnemonic);
    setSolKeys(savedSol);
    setEthKeys(savedEth);
    setKeyPairs(savedNetwork === "solana" ? savedSol : savedEth);
    }
    // Add a small delay to show the loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  const handleCreateKeyPair = () => {
    
    if (network === "solana") {
      const seed = mnemonicToSeedSync(mnemonic);

      let i = solKeys.length;
      const path = `m/44'/501'/${i}'/0'`; // This is the derivation path
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const newPublicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
      
      const updatedSolKeys = [...solKeys, newPublicKey];
      setSolKeys(updatedSolKeys);
      if(typeof window !== "undefined"){
      localStorage.setItem("solKeys", JSON.stringify(updatedSolKeys));
      }
      setKeyPairs(updatedSolKeys);
    } else if (network === "eth") {
      const seed = mnemonicToSeedSync(mnemonic);
      let i = ethKeys.length;
      
      const path = `m/44'/60'/${i}'/0'`; // This is the derivation path
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = Buffer.from(derivedSeed).toString("hex");
      const publicKey = new ethers.Wallet(secret);
     
      const key= publicKey.address;
      const updatedEthKeys = [...ethKeys, key];
      setEthKeys(updatedEthKeys);
      if(typeof window !== "undefined"){
      localStorage.setItem("ethKeys", JSON.stringify(updatedEthKeys));
      }
      setKeyPairs(updatedEthKeys);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center justify-center font-sans p-4">
      <div className={`flex flex-row justify-between items-center justify-between gap-2 mb-4 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <button 
          className="pb-3 cursor-pointer mr-4 hover:opacity-70 transition-opacity" 
          onClick={() => router.push("/network")}
        >
          &lt;-
        </button>
        <h1 className="flex flex-row justify-end text-2xl font-bold mb-4">
          Add new wallet
        </h1>
      </div>
      
      <div className={`flex flex-col items-center transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <button
          className="px-4 py-2 bg-white text-black rounded mb-4 hover:bg-gray-200 transition-colors duration-200 transform hover:scale-105"
          onClick={handleCreateKeyPair}
        >
          Create Key Pair
        </button>
        
        <div className="flex flex-col gap-4">
          {keyPairs.map((key, index) => (
            <div 
              key={index} 
              className="flex flex-col p-4 border rounded-lg opacity-0 animate-fade-in transform translate-y-4"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.2}s forwards`
              }}
            >
              <p className="text-lg font-semibold text-start">
                Wallet {index + 1}
              </p>
              <p className="text-xs break-all">{key}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}

export default Page;