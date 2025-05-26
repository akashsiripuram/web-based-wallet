"use client";
import { Toaster } from "sonner";
import { generateMnemonic } from "bip39";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function Page() {
    const [recoveryPhrase, setRecoveryPhrase] = useState(Array(12).fill(''));
    const [isLoaded, setIsLoaded] = useState(false);
    const [showPhrase, setShowPhrase] = useState(false);
    const [phraseGenerated, setPhraseGenerated] = useState(false);
    const router = useRouter();
   
    const handlePhrase = () => {
        const mnemonic = generateMnemonic();
        setRecoveryPhrase(mnemonic.split(' '));
        if(typeof window !== "undefined"){
        localStorage.setItem('recoveryPhrase', mnemonic);
        }
        return mnemonic;
    }
    
    useEffect(() => {
        // Initial load animation
        setTimeout(() => setIsLoaded(true), 100);
        
        // Generate phrase with delay for better UX
        setTimeout(() => {
            const mnemonic = handlePhrase();
            console.log("Generated Recovery Phrase:", mnemonic);
            setPhraseGenerated(true);
            
            // Show phrase words after generation
            setTimeout(() => setShowPhrase(true), 300);
        }, 800);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen font-sans p-4">
            <Toaster />
            
            {/* Header with fade-in */}
            <div className={`text-center mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Your Recovery Phrase
                </h1>
                <p className={`mt-4 text-gray-300 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    Save these words in a secure place
                </p>
            </div>

            {/* Loading indicator */}
            {!phraseGenerated && (
                <div className={`flex items-center justify-center mb-8 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <span className="ml-3 text-gray-300">Generating secure phrase...</span>
                </div>
            )}
            
            {/* Recovery phrase grid with staggered animation */}
            <div className={`grid grid-cols-3 gap-4 transition-all duration-700 delay-300 ${showPhrase ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {Array.from({ length: 12 }, (_, index) => (
                    <div 
                        key={index} 
                        className="flex flex-row items-center border w-[170px] bg-[#14151B] border-gray-700 p-3 rounded-xl transform transition-all duration-300 hover:scale-105 hover:border-gray-500"
                        style={{
                            animation: showPhrase ? `fadeInSlide 0.6s ease-out ${(index * 0.08)}s forwards` : 'none',
                            opacity: showPhrase ? 1 : 0
                        }}
                    >
                        <div className="text-sm text-[#969FAF] min-w-[20px]">{index + 1}</div>
                        <input
                            type="text"
                            value={recoveryPhrase[index]}
                            className="pl-2 focus:outline-none bg-transparent text-white w-full cursor-default"
                            readOnly
                            required
                        />
                    </div>
                ))}
            </div>
            
            {/* Warning message */}
            <div className={`mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg max-w-md text-center transition-all duration-700 delay-700 ${showPhrase ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-yellow-400 text-sm">
                    ⚠️ Write down these words in order and store them safely. 
                    You&apos;ll need them to recover your wallet.
                </p>
            </div>
            
            {/* Action buttons */}
            <div className={`mt-8 flex flex-row items-center gap-4 transition-all duration-700 delay-1000 ${showPhrase ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
               
                
                <button 
                    className="px-6 py-2 bg-transparent border border-gray-500 text-gray-300 rounded-2xl w-[200px] font-medium hover:bg-gray-800 hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
                    onClick={() => {
                        navigator.clipboard.writeText(recoveryPhrase.join(' '));
                        // You could add a toast here if needed
                    }}
                    disabled={!phraseGenerated}
                >
                    Copy to Clipboard
                </button>
                 <button 
                    className="px-6 py-3 bg-white text-black rounded-2xl w-[200px] font-medium hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" 
                    onClick={() => router.push("/network")}
                    disabled={!phraseGenerated}
                >
                   Next
                </button>
            </div>

            <style jsx>{`
                @keyframes fadeInSlide {
                    0% {
                        opacity: 0;
                        transform: translateX(-20px) scale(0.95);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                }
                
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}

export default Page;