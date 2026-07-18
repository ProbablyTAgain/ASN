const STORAGE_KEYS = {
  users: "asn_site_users",
  currentUser: "asn_site_current_user",
  profiles: "asn_site_profiles",
  events: "asn_site_events",
  verifications: "asn_site_verifications",
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

const generateToken = (userId) => {
  return btoa(`${userId}:${Date.now()}`);
};

const getUsers = () => readStorage(STORAGE_KEYS.users, []);
const saveUsers = (users) => writeStorage(STORAGE_KEYS.users, users);
const getCurrentUser = () => readStorage(STORAGE_KEYS.currentUser, null);
const saveCurrentUser = (user) => writeStorage(STORAGE_KEYS.currentUser, user);
const getProfiles = () => readStorage(STORAGE_KEYS.profiles, []);
const saveProfiles = (profiles) => writeStorage(STORAGE_KEYS.profiles, profiles);
const getEvents = () => readStorage(STORAGE_KEYS.events, []);
const saveEvents = (events) => writeStorage(STORAGE_KEYS.events, events);
const getVerifications = () => readStorage(STORAGE_KEYS.verifications, {});
const saveVerifications = (data) => writeStorage(STORAGE_KEYS.verifications, data);

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

const findUserByEmail = (email) => getUsers().find((user) => user.email.toLowerCase() === email.toLowerCase());
const getUserById = (id) => getUsers().find((user) => user.id === id);

const api = {
  auth: {
    register: async ({ email, password }) => {
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        throw new Error("A user with that email already exists.");
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const verifications = getVerifications();
      verifications[email.toLowerCase()] = { email, password, code, createdAt: Date.now() };
      saveVerifications(verifications);

      return { pending: true, code };
    },

    verifyOtp: async ({ email, otpCode }) => {
      const verifications = getVerifications();
      const verification = verifications[email.toLowerCase()];
      if (!verification || verification.code !== otpCode) {
        throw new Error("Invalid verification code.");
      }

      const newUser = {
        id: generateId(),
        email: verification.email,
        password: verification.password,
        createdAt: Date.now(),
      };
      const users = getUsers();
      saveUsers([...users, newUser]);
      delete verifications[email.toLowerCase()];
      saveVerifications(verifications);

      const token = generateToken(newUser.id);
      saveCurrentUser({ id: newUser.id, token });
      return { access_token: token };
    },

    setToken: (token) => {
      const current = getCurrentUser() || {};
      saveCurrentUser({ ...current, token });
    },

    resendOtp: async (email) => {
      const verifications = getVerifications();
      const verification = verifications[email.toLowerCase()];
      if (!verification) {
        throw new Error("No pending verification found for that email.");
      }
      verification.code = Math.floor(100000 + Math.random() * 900000).toString();
      verification.createdAt = Date.now();
      saveVerifications(verifications);
      return { code: verification.code };
    },

    loginViaEmailPassword: async (email, password) => {
      const user = findUserByEmail(email);
      if (!user || user.password !== password) {
        throw new Error("Invalid email or password.");
      }
      const token = generateToken(user.id);
      saveCurrentUser({ id: user.id, token });
      return { access_token: token };
    },

    loginWithProvider: (provider, redirect = "/") => {
      const providerEmail = `${provider}@local.provider`;
      let user = findUserByEmail(providerEmail);
      if (!user) {
        user = {
          id: generateId(),
          email: providerEmail,
          password: "",
          createdAt: Date.now(),
          provider,
        };
        saveUsers([...getUsers(), user]);
      }
      const token = generateToken(user.id);
      saveCurrentUser({ id: user.id, token });
      window.location.href = redirect;
    },

    resetPasswordRequest: async (email) => {
      const user = findUserByEmail(email);
      if (!user) {
        return { status: "ok" };
      }
      return { status: "ok" };
    },

    me: async () => {
      const current = getCurrentUser();
      if (!current?.id) {
        throw new Error("Not authenticated.");
      }
      const user = getUserById(current.id);
      if (!user) {
        throw new Error("User not found.");
      }
      return user;
    },
  },

  entities: {
    BusinessProfile: {
      list: async () => {
        return getProfiles();
      },
      filter: async (query) => {
        const profiles = getProfiles();
        return profiles.filter((profile) => {
          return Object.entries(query).every(([key, value]) => {
            if (Array.isArray(value)) {
              return value.every((item) => profile[key]?.includes(item));
            }
            return profile[key] === value;
          });
        });
      },
      update: async (id, data) => {
        const profiles = getProfiles();
        const updated = profiles.map((profile) => (profile.id === id ? { ...profile, ...data } : profile));
        saveProfiles(updated);
        return updated.find((profile) => profile.id === id) || null;
      },
      create: async (data) => {
        const newProfile = { id: generateId(), ...data, createdAt: Date.now() };
        const profiles = getProfiles();
        saveProfiles([...profiles, newProfile]);
        return newProfile;
      },
    },
    Event: {
      list: async () => {
        return ensureSampleEvents();
      },
    },
  },

  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        if (!file) {
          throw new Error("No file provided.");
        }
        return { file_url: URL.createObjectURL(file) };
      },
    },
  },
};

export { api };
