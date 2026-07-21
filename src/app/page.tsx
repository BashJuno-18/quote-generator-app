"use client";

import { useState, useEffect, useCallback } from "react";

type Quote = {
  content: string;
  author: string;
};

const backgrounds = [
  "/forest-bg.jpg",
  "/bg-1.jpg",
  "/bg-2.jpg",
  "/bg-3.jpg",
  "/bg-4.jpg",
  "/bg-5.jpg",
];

const fallbackQuotes: Quote[] = [
  { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
];

function getRandomFallback() {
  return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
}

async function fetchQuote(): Promise<Quote> {
  const res = await fetch("https://api.quotable.io/random?maxLength=120");
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return { content: data.content, author: data.author };
}

export default function Home() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const [nextBg, setNextBg] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const getQuote = useCallback(async () => {
    setLoading(true);
    try {
      const q = await fetchQuote();
      setQuote(q);
    } catch {
      setQuote(getRandomFallback());
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNewQuote = useCallback(() => {
    if (transitioning || nextBg !== null) return;
    getQuote();

    let newIdx;
    do {
      newIdx = Math.floor(Math.random() * backgrounds.length);
    } while (newIdx === currentBg);

    setNextBg(newIdx);
    requestAnimationFrame(() => {
      setTransitioning(true);
      setFadeIn(true);
    });
    setTimeout(() => {
      setCurrentBg(newIdx);
      setNextBg(null);
      setTransitioning(false);
      setFadeIn(false);
    }, 700);
  }, [getQuote, transitioning, nextBg, currentBg]);

  useEffect(() => {
    getQuote();
  }, [getQuote]);

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed transition-opacity duration-700"
          style={{
            backgroundImage: `url(${backgrounds[currentBg]})`,
            opacity: transitioning ? 0 : 1,
          }}
        />
        {nextBg !== null && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed transition-opacity duration-700"
            style={{
              backgroundImage: `url(${backgrounds[nextBg]})`,
              opacity: fadeIn ? 1 : 0,
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80 sm:p-12">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
            </div>
          ) : quote ? (
            <div className="space-y-6">
              <p className="text-center text-xl leading-relaxed text-zinc-800 dark:text-zinc-200 sm:text-2xl">
                &ldquo;{quote.content}&rdquo;
              </p>
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                &mdash; {quote.author}
              </p>
            </div>
          ) : null}

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleNewQuote}
              disabled={loading}
              className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {loading ? "Loading..." : "New Quote"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
