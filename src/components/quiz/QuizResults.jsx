import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw } from "lucide-react";
import { STEP_RECOMMENDATIONS } from "@/lib/quizRecommendations";

export default function QuizResults({ answers, onRestart }) {
  const steps = answers.sustainabilitySteps?.length ? answers.sustainabilitySteps : ["other"];
  const recommendations = [];
  const seenTitles = new Set();
  for (const step of steps) {
    for (const item of STEP_RECOMMENDATIONS[step] || []) {
      if (!seenTitles.has(item.title)) {
        seenTitles.add(item.title);
        recommendations.push(item);
      }
    }
  }
  const topRecommendations = recommendations.slice(0, 5);

  return (
    <div>
      <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Your Results</p>
      <h1 className="font-heading text-3xl md:text-5xl text-foreground leading-tight mb-4">
        Recommended resources for you
      </h1>
      <p className="text-foreground/70 text-lg mb-10">
        Based on your profile as a {answers.orgType} ({answers.employeeCount}), here are resources to get you started.
      </p>

      <div className="space-y-1 mb-12">
        {topRecommendations.map((item, i) => (
          <div key={i} className="border border-border p-6 bg-card">
            <h3 className="font-heading text-lg text-foreground mb-2">{item.title}</h3>
            <p className="text-foreground/70 text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          to="/register"
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors"
        >
          Connect with Resources <ArrowRight size={16} />
        </Link>
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-3 border border-foreground text-foreground px-8 py-4 text-sm tracking-[0.1em] uppercase hover:bg-foreground hover:text-background transition-colors"
        >
          <RefreshCw size={16} />
          Retake Quiz
        </button>
      </div>
    </div>
  );
}