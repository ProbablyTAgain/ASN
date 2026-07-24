import React from "react";
import { Phone, Mail, Building2, CalendarDays } from "lucide-react";

const features = [
{
  icon: Phone,
  title: "Direct Phone Access",
  description: "Call verified waste management partners directly — no middleman, no delays. Every resource in our directory has a confirmed phone line."
},
{
  icon: Mail,
  title: "Email Connect",
  description: "Initiate email conversations with resource providers instantly. Pre-formatted templates help you communicate your needs efficiently."
},
{
  icon: Building2,
  title: "Business Profiles",
  description: "Upload your logo and showcase your business. Build your brand's sustainability presence within Arizona's growing green economy."
},
{
  icon: CalendarDays,
  title: "Community Events",
  description: "Stay connected with sustainability workshops, networking events, and industry conferences happening across Arizona."
}];


export default function FeaturesSection() {
  return (
    <section className="py-24 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl mb-16 md:mb-24">
          <p className="tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))] text-sm">HOW IT WORKS</p>
          <h2 className="font-heading text-3xl md:text-5xl text-foreground leading-tight mb-6">
            Your bridge to sustainable waste management
          </h2>
          <div className="h-[0.5px] w-24 bg-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {features.map((feature, i) =>
          <div
            key={i}
            className="group p-8 md:p-12 border border-border hover:border-primary/30 transition-colors">
            
              <feature.icon
              size={28}
              className="text-primary mb-6"
              strokeWidth={1.5} />
            
              <h3 className="font-heading text-xl text-foreground mb-3">{feature.title}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{feature.description}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}