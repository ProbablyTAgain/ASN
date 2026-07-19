import React, { useState } from "react";
import { Phone, Mail, Globe, MapPin } from "lucide-react";

export default function ResourceCard({ business, onClick }) {
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  return (
    <div
      onClick={onClick}
      className="border border-border p-6 md:p-8 hover:border-primary/30 transition-colors bg-card cursor-pointer"
    >
      <div className="flex items-start gap-5 mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center overflow-hidden flex-shrink-0 bg-background">
          {business.logo_url ? (
            <img
              src={business.logo_url}
              alt={`${business.business_name} logo`}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="font-heading text-primary text-xl font-bold">
              {business.business_name?.charAt(0) || "B"}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-heading text-lg text-foreground font-semibold truncate">
            {business.business_name}
          </h3>
          {business.description && (
            <p className="text-foreground/70 text-sm mt-1 line-clamp-2">{business.description}</p>
          )}
        </div>
      </div>

      {business.waste_types?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {business.waste_types.map((type) => (
            <span
              key={type}
              className="text-xs tracking-[0.1em] uppercase text-accent bg-accent/10 px-3 py-1"
            >
              {type}
            </span>
          ))}
        </div>
      )}

      {business.zip_code && (
        <div className="flex items-center gap-2 text-foreground/70 text-sm mb-5">
          <MapPin size={14} />
          <span>{business.zip_code}</span>
        </div>
      )}

      <div className="h-[0.5px] bg-border mb-5" />

      <div className="flex gap-3">
        {business.phone && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (phoneRevealed) {
                window.location.href = `tel:${business.phone}`;
              } else {
                setPhoneRevealed(true);
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-3 text-sm tracking-[0.05em] uppercase hover:bg-primary transition-colors"
          >
            <Phone size={14} />
            {phoneRevealed ? business.phone : "Call Resource"}
          </button>
        )}
        {business.email && (
          <a
            href={`mailto:${business.email}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-2 border border-foreground text-foreground py-3 text-sm tracking-[0.05em] uppercase hover:bg-foreground hover:text-background transition-colors"
          >
            <Mail size={14} />
            Initiate Email
          </a>
        )}
      </div>

      {business.website && (
        <a
          href={business.website}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-2 mt-3 text-primary text-sm hover:underline"
        >
          <Globe size={14} />
          Visit Website
        </a>
      )}
    </div>
  );
}