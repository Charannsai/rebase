"use client";

import React, { useState } from "react";

// --- Icons ---
const SparklesIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576 2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z"
      clipRule="evenodd"
    />
  </svg>
);

const LoadingSpinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-gray-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function Chatbot() {
  // Chat State
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);

  const handleSendChat = async () => {
    if (!input.trim()) return;

    setChatLoading(true);
    setChatError(null);
    setResponse("");

    try {
      const res = await fetch(
        "/r2gdhpue/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: input }],
              },
            ],
          }),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "No response received";

      setResponse(text);
    } catch (err) {
      console.error(err);
      setChatError("Failed to get response from Gemini.");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-3xl relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Fuseplane Example <span className="text-gray-400 font-light mx-2">|</span> Chat Application
          </h1>
          <p className="text-gray-500">
            Securely interact with AI services
          </p>
        </div>

       <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Content Area */}
          <div className="p-6 md:p-10 min-h-[400px]">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide">Ask Gemini 2.5 Flash</label>
                <div className="relative">
                  <textarea
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-800 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all resize-none placeholder-gray-400 text-base shadow-inner"
                    rows={4}
                    placeholder="How can I help you today?"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-mono">
                    {input.length} chars
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSendChat}
                    disabled={chatLoading || !input.trim()}
                    className="bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center gap-2 text-sm"
                  >
                    {chatLoading ? (
                      <>
                        <LoadingSpinner /> Thinking...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4" /> Generate Response
                      </>
                    )}
                  </button>
                </div>
              </div>

              {chatError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                  {chatError}
                </div>
              )}

              {response && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-4 block">AI Response</span>
                  <div className="bg-gray-50/50 rounded-xl p-6 leading-relaxed text-gray-700">
                    <p className="whitespace-pre-wrap">
                      {response}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer/Status Bar */}
          
        </div>
      </div>
    </div>
  );
}
