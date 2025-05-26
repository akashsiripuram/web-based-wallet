"use client";
import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isExisting, setIsExisting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const router = useRouter();
   if(typeof window !== "undefined"){
        if(localStorage.getItem('recoveryPhrase')) {
           router.push("/network"); 
        }
  
      }
  useEffect(() => {
    // Trigger initial load animation
    setTimeout(() => setIsLoaded(true), 100);
    
    // If transitioning to existing wallet form, add a delay for smooth transition
    if (isExisting) {
      setTimeout(() => setShowImportForm(true), 300);
    }
  }, [isExisting]);
  
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const words = text.split(' ');
      if (words.length !== 12) {
        toast.error('Please paste a valid 12-word recovery phrase.');
        return;
      }
      const inputs = document.querySelectorAll('input[type="text"]');
      if (inputs.length !== 12) {
        toast.error('There should be exactly 12 input fields.');
        return;
      }
      inputs.forEach((input, index) => {
        input.value = words[index];
      });
      localStorage.setItem('recoveryPhrase', text);
      toast.success('Recovery phrase pasted successfully!');
    } catch (err) {
      toast.error('Failed to read clipboard contents. Please try again.');
      console.error(err);
    }
  };

  if (isExisting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen font-sans">
        <Toaster />
        
        {/* Header with fade-in */}
        <div className={`text-center transition-all duration-700 ${showImportForm ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <h1 className="text-4xl font-bold">Secret Recovery Phrase</h1>
          <p className="text-md mt-4 text-[#969FAF]">Enter or paste your phrase</p>
        </div>
        
        {/* Input grid with staggered animation */}
        <div className={`grid grid-cols-3 gap-4 mt-6 transition-all duration-700 delay-200 ${showImportForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {Array.from({ length: 12 }, (_, index) => (
            <div 
              key={index} 
              className="flex flex-row items-center border w-[170px] bg-[#14151B] border-black p-2 rounded-xl transform transition-all duration-500 hover:scale-105"
              style={{
                animation: showImportForm ? `fadeInScale 0.5s ease-out ${(index * 0.05) + 0.4}s forwards` : 'none',
                opacity: showImportForm ? 1 : 0
              }}
            >
              <div className="text-sm text-[#969FAF]">{index + 1}</div>
              <input
                type="text"
                className="pl-2 focus:outline-none bg-transparent text-white w-full"
                required
              />
            </div>
          ))}
        </div>
        
        {/* Buttons with fade-in */}
        <div className={`flex flex-row items-center mt-6 gap-4 transition-all duration-700 delay-500 ${showImportForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button 
            className="bg-[#0057EB33] cursor-pointer px-4 py-2 rounded-2xl w-1/2 hover:bg-[#0057EB66] transition-all duration-200 transform hover:scale-105" 
            onClick={handlePaste}
          >
            Paste
          </button>
          <button 
            className="cursor-pointer w-1/2 px-4 py-2 bg-white text-black rounded-2xl w-[200px] hover:bg-gray-200 transition-all duration-200 transform hover:scale-105" 
            onClick={() => router.push("/network")}
          >
            Import
          </button>
        </div>

        <style jsx>{`
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(0.8) translateY(10px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans">
      <Toaster />
      
      {/* Welcome header with fade-in */}
      <div className={`text-center transition-all duration-800 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Welcome to Zypher
        </h1>
        <p className={`mt-4 text-gray-300 transition-all duration-800 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          A sleek web wallet for generating and managing crypto keypairs.
        </p>
      </div>
      
      {/* Buttons with staggered fade-in */}
      <div className={`mt-8 flex flex-col items-center transition-all duration-800 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <button 
          className="mt-6 px-4 py-2 bg-white text-black rounded-2xl w-[200px] cursor-pointer hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 hover:shadow-lg" 
          onClick={() => router.push("/phrase")}
        >
          Create Wallet
        </button>
        <button 
          className="mt-4 px-4 py-2 bg-transparent border border-white text-white rounded-2xl w-[200px] cursor-pointer hover:bg-white hover:text-black transition-all duration-200 transform hover:scale-105 hover:shadow-lg" 
          onClick={() => setIsExisting(true)}
        >
          Import Existing Wallet
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}