import React, { useState } from "react";
import { MapPin, ExternalLink, Phone, Mail } from "lucide-react";

export default function CuratedResourceCard({ resource, onClick }) {
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  return (
    <div
      onClick={onClick}
      className="h-full flex flex-col border border-border p-6 hover:border-primary/30 transition-colors bg-card cursor-pointer"
    >
      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center overflow-hidden flex-shrink-0 bg-background">
          <img
            src={`${import.meta.env.BASE_URL}resource_placeholder.png`}
            alt=""
            className="block w-9 h-9 object-contain"
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-heading text-lg text-foreground font-semibold">
            <span
              className="text-foreground/50 mr-1"
              title="Official resource — provided directly, not a business submission"
            >
              *
            </span>
            <span className="line-clamp-2">{resource.resource_name}</span>
          </h3>
          {resource.category && (
            <p className="text-[hsl(92_45%_34%)] text-sm mt-0.5 line-clamp-2">{resource.category}</p>
          )}
        </div>
      </div>

      {(resource.city || resource.county) && (
        <div className="flex items-center gap-2 text-foreground/70 text-sm mb-5">
          <MapPin size={14} className="flex-shrink-0" />
          <span className="truncate">
            {[resource.city, resource.county].filter(Boolean).join(", ")}
          </span>
        </div>
      )}

      <div className="mt-auto">
        <div className="h-[0.5px] bg-border mb-5" />

        {(resource.phone || resource.email) && (
          <div className="flex gap-2 mb-2">
            {resource.phone && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (phoneRevealed) {
                    window.location.href = `tel:${resource.phone}`;
                  } else {
                    setPhoneRevealed(true);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-foreground text-background px-3 py-2.5 text-sm tracking-[0.03em] uppercase hover:bg-primary transition-colors whitespace-nowrap"
              >
                <Phone size={13} className="flex-shrink-0" />
                <span className="truncate">{phoneRevealed ? resource.phone : "Call"}</span>
              </button>
            )}
            {resource.email && (
              <a
                href={`mailto:${resource.email}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-1.5 border border-foreground text-foreground px-3 py-2.5 text-sm tracking-[0.03em] uppercase hover:bg-foreground hover:text-background transition-colors whitespace-nowrap"
              >
                <Mail size={13} className="flex-shrink-0" />
                Email
              </a>
            )}
          </div>
        )}

        {resource.link ? (
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground px-3 py-2.5 text-sm tracking-[0.03em] uppercase hover:bg-foreground transition-colors whitespace-nowrap"
          >
            <ExternalLink size={13} className="flex-shrink-0" />
            Visit
          </a>
        ) : (
          <p className="text-foreground/50 text-sm text-center py-2.5">No link available</p>
        )}
      </div>
    </div>
  );
}
