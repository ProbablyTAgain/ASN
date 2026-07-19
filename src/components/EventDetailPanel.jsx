import React from "react";
import { X, MapPin, Clock, Mail, CalendarDays } from "lucide-react";
import moment from "moment";

export default function EventDetailPanel({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-background h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right">
        <div className="sticky top-0 bg-background z-10 p-6 border-b border-border flex items-center justify-between">
          <span className="text-xs tracking-[0.2em] uppercase text-primary">Event Details</span>
          <button onClick={onClose} className="text-foreground/70 hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        {event.image_url && (
          <img src={event.image_url} alt={event.title} className="w-full aspect-video object-cover" />
        )}

        <div className="p-8">
          {event.category && (
            <span className="inline-block text-xs tracking-[0.15em] uppercase text-accent bg-accent/10 px-3 py-1 mb-4">
              {event.category}
            </span>
          )}

          <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-6">{event.title}</h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-foreground/70">
              <CalendarDays size={16} className="text-primary" />
              <span className="text-sm">{moment(event.date).format("MMMM D, YYYY")}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-3 text-foreground/70">
                <Clock size={16} className="text-primary" />
                <span className="text-sm">{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-3 text-foreground/70">
                <MapPin size={16} className="text-primary" />
                <span className="text-sm">{event.location}</span>
              </div>
            )}
          </div>

          {event.description && (
            <>
              <div className="h-[0.5px] bg-border mb-6" />
              <p className="text-foreground/70 text-sm leading-relaxed">{event.description}</p>
            </>
          )}

          {event.contact_email && (
            <>
              <div className="h-[0.5px] bg-border my-6" />
              <a
                href={`mailto:${event.contact_email}`}
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors w-full"
              >
                <Mail size={14} />
                Contact Organizer
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}