import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="copper-thread" />
      <Navbar />

      <div className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Our Mission</p>
          <h1 className="font-heading text-4xl md:text-6xl text-foreground leading-tight mb-6 max-w-3xl">
            Building a greener Arizona, one connection at a time
          </h1>
          <p className="text-foreground/60 text-lg max-w-2xl leading-relaxed">
            The Arizona Sustainability Navigator exists to close the gap between local businesses and the waste management resources they need to operate responsibly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="h-[0.5px] bg-border mb-16 md:mb-24" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center mb-24 md:mb-32">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-6">Why we exist</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">
              Across Arizona, thousands of businesses generate waste every day — electronics, organic material, construction debris, hazardous byproducts — yet finding the right disposal or recycling partner is often confusing, time-consuming, and disconnected from real people.
            </p>
            <p className="text-foreground/70 leading-relaxed">
              We built the Navigator to remove that friction. By putting verified waste management resources one phone call or email away, we help businesses act on sustainability instead of just intending to.
            </p>
          </div>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
            <div className="h-full aspect-[4/3]" />
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-background">
              <div>
                <p className="font-semibold text-lg">Arizona recycling and sustainability hub</p>
                <p className="mt-3 text-foreground/70">A local asset illustration for our mission-driven platform.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-24 md:mb-32">
          {[
            {
              title: "Connect",
              text: "Direct phone and email access to verified waste management resources across the state — no middlemen, no delays."
            },
            {
              title: "Grow",
              text: "Businesses build a public profile with their logo and story, gaining visibility as leaders in Arizona's green economy."
            },
            {
              title: "Engage",
              text: "A calendar of workshops, networking, and conferences keeps the community learning and connected year-round."
            }
          ].map((item) => (
            <div key={item.title} className="p-8 md:p-10 border border-border">
              <h3 className="font-heading text-xl text-foreground mb-3">{item.title}</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center pb-24 md:pb-32">
          <h2 className="font-heading text-2xl md:text-4xl text-foreground mb-6 max-w-xl mx-auto">
            Join the businesses shaping Arizona's sustainable future
          </h2>
          <Link
            to="/register"
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors"
          >
            Create Your Account <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}