import React, { useState } from "react";
import { X } from "lucide-react";
import { api } from "@/api/client";

const CATEGORIES = ["cleanup", "workshop", "networking", "conference", "webinar"];

export default function AddEventModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    category: "workshop",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) {
      setError("Title and date are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const created = await api.entities.Event.create({
        ...form,
        date: new Date(form.date).toISOString(),
      });
      onCreated(created);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card border border-border p-8 md:p-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-foreground/70 hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Post an Event</p>
        <h2 className="font-heading text-2xl text-foreground mb-8">Add to the Calendar</h2>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 text-destructive text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Event Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Zero Waste Workshop"
              className="w-full bg-background border border-border px-4 py-3 text-foreground text-sm placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full bg-background border border-border px-4 py-3 text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full bg-background border border-border px-4 py-3 text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Tempe Library"
              className="w-full bg-background border border-border px-4 py-3 text-foreground text-sm placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              placeholder="What's this event about?"
              className="w-full bg-background border border-border px-4 py-3 text-foreground text-sm placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground py-3.5 text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
