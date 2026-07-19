import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SustainabilityIllustration from "@/components/SustainabilityIllustration";

export default function MissionSection() {
  return (
    <section className="py-24 md:py-40 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="tracking-[0.3em] uppercase mb-4 text-sm text-[hsl(var(--accent))]">OUR MISSION</p>
            <h2 className="font-heading text-3xl md:text-5xl text-foreground leading-tight mb-6">
              Building a greener Arizona, one connection at a time
            </h2>
            <div className="h-[0.5px] w-24 bg-primary mb-8" />
            <p className="text-foreground/70 leading-relaxed mb-8 max-w-lg">
              We close the gap between local businesses and the waste management resources they need to operate responsibly — putting verified partners one phone call or email away.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-primary text-sm tracking-[0.1em] uppercase hover:gap-4 transition-all">
              
              Learn More About Us <ArrowRight size={14} />
            </Link>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 aspect-[4/3]">
            <SustainabilityIllustration />
          </div>
        </div>
      </div>
    </section>);

}