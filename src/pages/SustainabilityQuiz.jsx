import React, { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuizResults from "@/components/quiz/QuizResults";
import {
  ORG_TYPE_OPTIONS,
  EMPLOYEE_COUNT_OPTIONS,
  SUSTAINABILITY_STEP_OPTIONS,
  TOOLS_USED_OPTIONS,
  CHALLENGES_OPTIONS,
  SUPPORT_OPTIONS } from
"@/lib/quizRecommendations";

const TOTAL_STEPS = 6;

const INITIAL_ANSWERS = {
  orgType: "",
  orgTypeOther: "",
  employeeCount: "",
  sustainabilitySteps: [],
  sustainabilityOther: "",
  toolsUsed: [],
  toolsUsedOther: "",
  challenges: [],
  challengesOther: "",
  supportNeeded: [],
  supportNeededOther: ""
};

export default function SustainabilityQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);

  const update = (field, value) => setAnswers((prev) => ({ ...prev, [field]: value }));

  const toggleStep = (value) => {
    setAnswers((prev) => ({
      ...prev,
      sustainabilitySteps: prev.sustainabilitySteps.includes(value) ?
      prev.sustainabilitySteps.filter((v) => v !== value) :
      [...prev.sustainabilitySteps, value]
    }));
  };

  const toggleMultiSelect = (field, value, exclusiveValue) => {
    setAnswers((prev) => {
      const current = prev[field];
      let next;
      if (current.includes(value)) {
        next = current.filter((v) => v !== value);
      } else if (exclusiveValue && value === exclusiveValue) {
        next = [exclusiveValue];
      } else if (exclusiveValue && current.includes(exclusiveValue)) {
        next = [value];
      } else {
        next = [...current, value];
      }
      return { ...prev, [field]: next };
    });
  };

  const canContinue = () => {
    if (step === 0) return answers.orgType && (answers.orgType !== "Other" || answers.orgTypeOther.trim());
    if (step === 1) return !!answers.employeeCount;
    if (step === 2) {
      return (
        answers.sustainabilitySteps.length > 0 && (
        !answers.sustainabilitySteps.includes("other") || answers.sustainabilityOther.trim()));

    }
    if (step === 3) {
      return (
        answers.toolsUsed.length > 0 && (
        !answers.toolsUsed.includes("other") || answers.toolsUsedOther.trim()));

    }
    if (step === 4) {
      return (
        answers.challenges.length > 0 && (
        !answers.challenges.includes("other") || answers.challengesOther.trim()));

    }
    if (step === 5) {
      return (
        answers.supportNeeded.length > 0 && (
        !answers.supportNeeded.includes("other") || answers.supportNeededOther.trim()));

    }
    return true;
  };

  const handleContinue = () => {
    if (!canContinue()) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleRestart = () => {
    setAnswers(INITIAL_ANSWERS);
    setStep(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="copper-thread" />
      <Navbar />

      <div className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-2xl mx-auto px-6 md:px-12">
          {step < TOTAL_STEPS && <QuizProgress step={step} total={TOTAL_STEPS} />}

          {step === 0 &&
          <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))]">Question 1 of {TOTAL_STEPS}</p>
              <h1 className="font-heading text-2xl md:text-4xl text-foreground leading-tight mb-10">
                What best describes your organization?
              </h1>

              <div className="mb-10">
                <div className="flex flex-wrap gap-2">
                  {ORG_TYPE_OPTIONS.map((option) =>
                <button
                  key={option}
                  onClick={() => update("orgType", option)}
                  className={`px-4 py-2.5 text-sm tracking-[0.02em] transition-colors ${
                  answers.orgType === option ?
                  "bg-primary text-primary-foreground" :
                  "border border-border text-foreground/70 hover:border-primary hover:text-primary"}`
                  }>
                  
                      {option}
                    </button>
                )}
                </div>

                {answers.orgType === "Other" &&
              <input
                type="text"
                value={answers.orgTypeOther}
                onChange={(e) => update("orgTypeOther", e.target.value)}
                placeholder="Tell us more"
                className="w-full bg-card border border-border px-4 py-3.5 text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors mt-4" />

              }
              </div>
            </div>
          }

          {step === 1 &&
          <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))]">Question 2 of {TOTAL_STEPS}</p>
              <h1 className="font-heading text-2xl md:text-4xl text-foreground leading-tight mb-10">
                How many employees do you have?
              </h1>

              <div className="flex flex-wrap gap-2 mb-10">
                {EMPLOYEE_COUNT_OPTIONS.map((option) =>
              <button
                key={option}
                onClick={() => update("employeeCount", option)}
                className={`px-4 py-2.5 text-sm tracking-[0.02em] transition-colors ${
                answers.employeeCount === option ?
                "bg-primary text-primary-foreground" :
                "border border-border text-foreground/70 hover:border-primary hover:text-primary"}`
                }>
                
                    {option}
                  </button>
              )}
              </div>
            </div>
          }

          {step === 2 &&
          <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))]">Question 3 of {TOTAL_STEPS}</p>
              <h1 className="font-heading text-2xl md:text-4xl text-foreground leading-tight mb-10">
                Have you taken steps to make your organization more environmentally sustainable?
              </h1>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {SUSTAINABILITY_STEP_OPTIONS.map((option) =>
                <button
                  key={option.value}
                  onClick={() => toggleStep(option.value)}
                  className={`px-5 py-3 text-sm tracking-[0.02em] transition-colors ${
                  answers.sustainabilitySteps.includes(option.value) ?
                  "bg-primary text-primary-foreground" :
                  "border border-border text-foreground/70 hover:border-primary hover:text-primary"}`
                  }>
                  
                      {option.label}
                    </button>
                )}
                </div>

                {answers.sustainabilitySteps.includes("other") &&
              <input
                type="text"
                value={answers.sustainabilityOther}
                onChange={(e) => update("sustainabilityOther", e.target.value)}
                placeholder="Tell us more"
                className="w-full bg-card border border-border px-4 py-3.5 text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors mt-4" />

              }
              </div>
              <p className="text-foreground/70 text-sm mb-10">Select all that apply.</p>
            </div>
          }

          {step === 3 &&
          <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))]">Question 4 of {TOTAL_STEPS}</p>
              <h1 className="font-heading text-2xl md:text-4xl text-foreground leading-tight mb-10">
                What sustainability-related tools, services or programs has your organization already used or explored?
              </h1>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {TOOLS_USED_OPTIONS.map((option) =>
                <button
                  key={option.value}
                  onClick={() => toggleMultiSelect("toolsUsed", option.value, "none")}
                  className={`px-5 py-3 text-sm tracking-[0.02em] transition-colors ${
                  answers.toolsUsed.includes(option.value) ?
                  "bg-primary text-primary-foreground" :
                  "border border-border text-foreground/70 hover:border-primary hover:text-primary"}`
                  }>
                  
                      {option.label}
                    </button>
                )}
                </div>

                {answers.toolsUsed.includes("other") &&
              <input
                type="text"
                value={answers.toolsUsedOther}
                onChange={(e) => update("toolsUsedOther", e.target.value)}
                placeholder="Tell us more"
                className="w-full bg-card border border-border px-4 py-3.5 text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors mt-4" />

              }
              </div>
              <p className="text-foreground/70 text-sm mb-10">Select all that apply.</p>
            </div>
          }

          {step === 4 &&
          <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))]">Question 5 of {TOTAL_STEPS}</p>
              <h1 className="font-heading text-2xl md:text-4xl text-foreground leading-tight mb-10">
                What are the biggest challenges or barriers to using any new potential sustainability tools for your organization?
              </h1>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {CHALLENGES_OPTIONS.map((option) =>
                <button
                  key={option.value}
                  onClick={() => toggleMultiSelect("challenges", option.value)}
                  className={`px-5 py-3 text-sm tracking-[0.02em] transition-colors ${
                  answers.challenges.includes(option.value) ?
                  "bg-primary text-primary-foreground" :
                  "border border-border text-foreground/70 hover:border-primary hover:text-primary"}`
                  }>
                  
                      {option.label}
                    </button>
                )}
                </div>

                {answers.challenges.includes("other") &&
              <input
                type="text"
                value={answers.challengesOther}
                onChange={(e) => update("challengesOther", e.target.value)}
                placeholder="Tell us more"
                className="w-full bg-card border border-border px-4 py-3.5 text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors mt-4" />

              }
              </div>
              <p className="text-foreground/70 text-sm mb-10">Select all that apply.</p>
            </div>
          }

          {step === 5 &&
          <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))]">Question 6 of {TOTAL_STEPS}</p>
              <h1 className="font-heading text-2xl md:text-4xl text-foreground leading-tight mb-10">
                What kind of support would make it easier for your organization to implement sustainable practices?
              </h1>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {SUPPORT_OPTIONS.map((option) =>
                <button
                  key={option.value}
                  onClick={() => toggleMultiSelect("supportNeeded", option.value)}
                  className={`px-5 py-3 text-sm tracking-[0.02em] transition-colors ${
                  answers.supportNeeded.includes(option.value) ?
                  "bg-primary text-primary-foreground" :
                  "border border-border text-foreground/70 hover:border-primary hover:text-primary"}`
                  }>
                  
                      {option.label}
                    </button>
                )}
                </div>

                {answers.supportNeeded.includes("other") &&
              <input
                type="text"
                value={answers.supportNeededOther}
                onChange={(e) => update("supportNeededOther", e.target.value)}
                placeholder="Tell us more"
                className="w-full bg-card border border-border px-4 py-3.5 text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors mt-4" />

              }
              </div>
              <p className="text-foreground/70 text-sm mb-10">Select all that apply.</p>
            </div>
          }

          {step < TOTAL_STEPS &&
          <div className="flex items-center gap-4">
              {step > 0 &&
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-3 border border-foreground text-foreground px-8 py-4 text-sm tracking-[0.1em] uppercase hover:bg-foreground hover:text-background transition-colors">
              
                  <ArrowLeft size={16} /> Back
                </button>
            }
              <button
              onClick={handleContinue}
              disabled={!canContinue()}
              className="inline-flex items-center gap-3 text-primary-foreground px-8 py-4 text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-[hsl(var(--accent))]">
              
                Continue <ArrowRight size={16} />
              </button>
            </div>
          }

          {step === TOTAL_STEPS && <QuizResults answers={answers} onRestart={handleRestart} />}
        </div>
      </div>

      <Footer />
    </div>);

}