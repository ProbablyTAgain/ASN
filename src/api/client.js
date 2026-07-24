import { supabase } from "@/lib/supabase";

// Local fallback for events until the `events` table migration
// (supabase/migrations/0004_events.sql) has been run against the project.
// Once that table exists, Supabase calls stop erroring and this is skipped.
const LOCAL_EVENTS_KEY = "asn_local_events";

const readLocalEvents = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_EVENTS_KEY)) || [];
  } catch {
    return [];
  }
};

const writeLocalEvents = (events) => {
  localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
};

const generateLocalId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const ensureLocalSampleEvents = () => {
  const existing = readLocalEvents();
  if (existing.length > 0) return existing;

  const sampleEvents = [
    {
      id: generateLocalId(),
      title: "Community Cleanup Day",
      organization: "Keep Phoenix Beautiful",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Downtown Phoenix",
      categories: ["cleanup"],
      waste_types: ["Recycling", "Chemicals"],
      description: "Join neighbors to clean up local parks and public spaces.",
      created_by: null,
    },
    {
      id: generateLocalId(),
      title: "Zero Waste Workshop",
      organization: "Tempe Public Library",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Tempe Library",
      categories: ["workshop"],
      waste_types: ["Food", "Recycling"],
      description: "Learn practical tips to reduce waste at home and work.",
      created_by: null,
    },
    {
      id: generateLocalId(),
      title: "Sustainability Networking Night",
      organization: "Scottsdale Innovation Hub",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Scottsdale Innovation Hub",
      categories: ["networking", "conference"],
      waste_types: [],
      description: "Connect with other sustainability-minded local businesses.",
      created_by: null,
    },
  ];
  writeLocalEvents(sampleEvents);
  return sampleEvents;
};

const api = {
  entities: {
    BusinessProfile: {
      list: async () => {
        const { data, error } = await supabase
          .from("business_profiles")
          .select("*")
          .eq("is_listed", true)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
      },
      filter: async (query) => {
        let request = supabase.from("business_profiles").select("*");
        for (const [key, value] of Object.entries(query)) {
          request = request.eq(key, value);
        }
        const { data, error } = await request;
        if (error) throw error;
        return data;
      },
      update: async (id, data) => {
        const { data: updated, error } = await supabase
          .from("business_profiles")
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return updated;
      },
      create: async (data) => {
        const { data: created, error } = await supabase
          .from("business_profiles")
          .upsert({ ...data, updated_at: new Date().toISOString() }, { onConflict: "user_id" })
          .select()
          .single();
        if (error) throw error;
        return created;
      },
    },
    Event: {
      list: async () => {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true });
        if (error) {
          return [...ensureLocalSampleEvents()].sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        return data;
      },
      create: async (data) => {
        const { data: created, error } = await supabase
          .from("events")
          .insert(data)
          .select()
          .single();
        if (error) {
          const newEvent = { id: generateLocalId(), ...data, created_at: new Date().toISOString() };
          writeLocalEvents([...readLocalEvents(), newEvent]);
          return newEvent;
        }
        return created;
      },
      update: async (id, data) => {
        const { data: updated, error } = await supabase
          .from("events")
          .update(data)
          .eq("id", id)
          .select()
          .single();
        if (error) {
          const events = readLocalEvents();
          const updatedEvent = { ...events.find((e) => e.id === id), ...data, id };
          writeLocalEvents(events.map((e) => (e.id === id ? updatedEvent : e)));
          return updatedEvent;
        }
        return updated;
      },
      delete: async (id) => {
        const { error } = await supabase.from("events").delete().eq("id", id);
        if (error) {
          writeLocalEvents(readLocalEvents().filter((e) => e.id !== id));
          return;
        }
      },
    },
  },

  integrations: {
    Core: {
      UploadFile: async ({ file, userId }) => {
        if (!file) {
          throw new Error("No file provided.");
        }
        if (!userId) {
          throw new Error("You must be signed in to upload a file.");
        }
        if (!file.type || !file.type.startsWith("image/")) {
          throw new Error("Please upload an image file.");
        }
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_FILE_SIZE) {
          throw new Error("Image must be smaller than 5MB.");
        }

        const extension = file.name.split(".").pop() || "jpg";
        const path = `${userId}/logo-${Date.now()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("business-logos")
          .upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("business-logos").getPublicUrl(path);
        return { file_url: data.publicUrl };
      },
    },
  },
};

export { api };
