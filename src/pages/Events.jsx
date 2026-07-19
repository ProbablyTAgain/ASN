import React, { useState, useEffect, useRef } from "react";
import { api } from "@/api/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventDetailPanel from "@/components/EventDetailPanel";
import EventsCalendar from "@/components/EventsCalendar";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await api.entities.Event.list("date", 50);
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = selectedDate
    ? events.filter((e) => moment(e.date).isSame(selectedDate, "day"))
    : events;

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  const categoryColors = {
    workshop: "bg-primary/10 text-primary",
    networking: "bg-accent/10 text-accent",
    conference: "bg-foreground/10 text-foreground",
    cleanup: "bg-accent/10 text-accent",
    webinar: "bg-primary/10 text-primary"
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="copper-thread" />
      <Navbar />

      <div className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">The Horizon Calendar</p>
          <h1 className="font-heading text-4xl md:text-6xl text-foreground leading-tight mb-4">
            Sustainability Events
          </h1>
          <p className="text-foreground/70 text-lg max-w-xl">
            Workshops, networking, and community events driving Arizona's green economy forward.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="h-[0.5px] bg-border mb-8" />
        {!loading && events.length > 0 && (
          <EventsCalendar events={events} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-24 max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-foreground/70 text-lg mb-2">No upcoming events</p>
          <p className="text-foreground/70 text-sm">
            Check back soon for sustainability events across Arizona.
          </p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-24 max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-foreground/70 text-lg mb-2">No events on this date</p>
          <p className="text-foreground/70 text-sm">
            Try selecting a different date on the calendar.
          </p>
        </div>
      ) : (
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 mb-16">
          {/* Scroll controls */}
          <div className="flex gap-2 mb-6 justify-end">
            <button
              onClick={() => scroll(-1)}
              className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Horizontal Timeline */}
          <div
            ref={scrollRef}
            className="flex gap-1 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="flex-shrink-0 w-72 border border-border hover:border-primary/30 transition-colors bg-card text-left flex flex-col"
              >
                {/* Date pillar top */}
                <div className="p-6 border-b border-border">
                  <span className="font-heading text-3xl text-primary block">
                    {moment(event.date).format("DD")}
                  </span>
                  <span className="text-xs tracking-[0.15em] uppercase text-foreground/70">
                    {moment(event.date).format("MMM YYYY")}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {event.category && (
                    <span className={`inline-block self-start text-xs tracking-[0.1em] uppercase px-2 py-0.5 mb-3 ${categoryColors[event.category] || "bg-border text-foreground"}`}>
                      {event.category}
                    </span>
                  )}
                  <h3 className="font-heading text-lg text-foreground mb-2 line-clamp-2">{event.title}</h3>
                  {event.location && (
                    <p className="text-foreground/70 text-sm mt-auto">{event.location}</p>
                  )}
                </div>

                {/* Join button */}
                <div className="p-6 pt-0">
                  <span className="block text-center bg-foreground text-background py-2.5 text-xs tracking-[0.1em] uppercase hover:bg-primary transition-colors">
                    View Details
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <Footer />

      {selectedEvent && (
        <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}