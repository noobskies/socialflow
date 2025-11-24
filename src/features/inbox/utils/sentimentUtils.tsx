import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function getSentimentIcon(
  sentiment: "positive" | "neutral" | "negative",
  className: string = "w-4 h-4"
) {
  const color = getSentimentColor(sentiment);
  const combinedClassName = `${className} ${color}`;

  switch (sentiment) {
    case "positive":
      return <TrendingUp className={combinedClassName} />;
    case "negative":
      return <TrendingDown className={combinedClassName} />;
    case "neutral":
      return <Minus className={combinedClassName} />;
  }
}

export function getSentimentColor(
  sentiment: "positive" | "neutral" | "negative"
) {
  switch (sentiment) {
    case "positive":
      return "text-emerald-500";
    case "negative":
      return "text-rose-500";
    case "neutral":
      return "text-slate-400";
  }
}
