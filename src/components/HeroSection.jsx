import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HeroIllustration from "@/components/HeroIllustration";
import { WASTE_TYPES } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      <HeroIllustration />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-6">
              Arizona Sustainability Navigator
            </p>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[0.9] mb-8">
              NAVIGATE<br />
              <span className="text-[hsl(var(--accent))]">WASTE.</span>
            </h1>
            <p className="text-foreground/70 text-lg md:text-xl max-w-lg leading-relaxed mb-10">
              Connecting Arizona businesses to the waste management resources they need — through direct phone and email access to verified partners.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/quiz"
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors">
                
                Sustainability Quiz <ArrowRight size={16} />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-3 border border-foreground text-foreground px-8 py-4 text-sm tracking-[0.1em] uppercase hover:bg-foreground hover:text-background transition-colors">
                
                Browse Resources
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-background/80 backdrop-blur-xl border border-border p-8 md:p-10 shadow-[0_8px_32px_hsl(var(--primary)_/_0.08)]">
              <h3 className="font-heading text-xl text-foreground mb-6">Quick Connect</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Waste Type</label>
                  <select className="w-full bg-white border border-border px-4 py-3 text-foreground text-sm focus:border-primary focus:outline-none transition-colors">
                    <option value="">Select waste type</option>
                    {WASTE_TYPES.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Zip Code</label>
                  <input
                    type="text"
                    placeholder="Enter zip code"
                    className="w-full bg-white border border-border px-4 py-3 text-foreground text-sm placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors" />
                  
                </div>
              </div>
              <Link
                to="/dashboard"
                className="block text-center bg-foreground text-background py-3.5 text-sm tracking-[0.1em] uppercase hover:bg-primary transition-colors w-full">
                
                Find Resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>);

}