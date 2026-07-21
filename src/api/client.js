import { supabase } from "@/lib/supabase";

const STORAGE_KEYS = {
  events: "asn_site_events",
};

const readStorage = (key, defaultValue) => {
  const value = localStorage.getItem(key);
  if (!value) return defaultValue;
  try {
    return JSON.parse(value);
  } catch {
    return defaultValue;
  }
};

const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const getEvents = () => readStorage(STORAGE_KEYS.events, []);
const saveEvents = (events) => writeStorage(STORAGE_KEYS.events, events);

const ensureSampleEvents = () => {
  const existing = getEvents();
  if (existing.length > 0) return existing;

  const sampleEvents = [
    {
      id: generateId(),
      title: "Community Cleanup Day",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Downtown Phoenix",
      category: "cleanup",
      description: "Join neighbors to clean up local parks and public spaces.",
    },
    {
      id: generateId(),
      title: "Zero Waste Workshop",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Tempe Library",
      category: "workshop",
      description: "Learn practical tips to reduce waste at home and work.",
    },
    {
      id: generateId(),
      title: "Sustainability Networking Night",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Scottsdale Innovation Hub",
      category: "networking",
      description: "Connect with other sustainability-minded local businesses.",
    },
  ];
  saveEvents(sampleEvents);
  return sampleEvents;
};

const api = {
  entities: {
    BusinessProfile: {
      list: async () => {
        const { data, error } = await supabase
          .from("business_profiles")
          .select("*")
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
        const events = ensureSampleEvents();
        return [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
      },
      create: async (data) => {
        const events = ensureSampleEvents();
        const newEvent = { id: generateId(), ...data, createdAt: Date.now() };
        saveEvents([...events, newEvent]);
        return newEvent;
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
