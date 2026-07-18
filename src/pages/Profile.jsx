import React, { useState, useEffect, useRef } from "react";
import { api } from "@/api/client";
import { Upload, Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WASTE_TYPES = ["Electronics", "Organic", "Construction", "Hazardous", "Recyclables", "Industrial"];

export default function Profile() {
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [existingId, setExistingId] = useState(null);
  const [form, setForm] = useState({
    business_name: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    zip_code: "",
    logo_url: "",
    waste_types: []
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = await api.auth.me();
      const profiles = await api.entities.BusinessProfile.filter({ created_by_id: user.id });
      if (profiles.length > 0) {
        const p = profiles[0];
        setExistingId(p.id);
        setForm({
          business_name: p.business_name || "",
          description: p.description || "",
          phone: p.phone || "",
          email: p.email || "",
          website: p.website || "",
          zip_code: p.zip_code || "",
          logo_url: p.logo_url || "",
          waste_types: p.waste_types || []
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await api.integrations.Core.UploadFile({ file });
      setForm((prev) => ({ ...prev, logo_url: file_url }));
    } catch (e) {
      toast({ title: "Upload failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const toggleWasteType = (type) => {
    setForm((prev) => ({
      ...prev,
      waste_types: prev.waste_types.includes(type)
        ? prev.waste_types.filter((t) => t !== type)
        : [...prev.waste_types, type]
    }));
  };

  const handleSave = async () => {
    if (!form.business_name.trim()) {
      toast({ title: "Business name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (existingId) {
        await api.entities.BusinessProfile.update(existingId, form);
      } else {
        const created = await api.entities.BusinessProfile.create(form);
        setExistingId(created.id);
      }
      toast({ title: "Profile saved successfully" });
    } catch (e) {
      toast({ title: "Failed to save", description: "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="copper-thread" />
      <Navbar />

      <div className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-2xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4 text-center">The Collective Canvas</p>
          <h1 className="font-heading text-4xl md:text-5xl text-foreground leading-tight mb-4 text-center">
            Your Business Profile
          </h1>
          <p className="text-foreground/60 text-center mb-12">
            Your business is a pillar of the Arizona future.
          </p>

          {/* Logo Upload */}
          <div className="flex flex-col items-center mb-12">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-48 h-48 md:w-56 md:h-56 rounded-full border-2 border-dashed border-primary flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors overflow-hidden"
            >
              {uploading ? (
                <Loader2 size={32} className="text-primary animate-spin" />
              ) : form.logo_url ? (
                <img src={form.logo_url} alt="Business logo" className="w-full h-full object-cover rounded-full" />
              ) : (
                <>
                  <Upload size={28} className="text-primary mb-3" />
                  <span className="text-primary text-xs tracking-[0.1em] uppercase">Upload Logo</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            {form.logo_url && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-primary text-xs tracking-[0.1em] uppercase hover:underline"
              >
                Change Logo
              </button>
            )}
          </div>

          {/* Live Name Preview */}
          {form.business_name && (
            <div className="text-center mb-12 py-6 border-t border-b border-border">
              <p className="text-xs tracking-[0.2em] uppercase text-foreground/40 mb-2">Preview</p>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground">{form.business_name}</h2>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="text-xs tracking-[0.15em] uppercase text-foreground/50 block mb-2">Business Name *</label>
              <input
                type="text"
                value={form.business_name}
                onChange={(e) => setForm((prev) => ({ ...prev, business_name: e.target.value }))}
                placeholder="Your business name"
                className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs tracking-[0.15em] uppercase text-foreground/50 block mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Tell us about your business and sustainability efforts..."
                rows={4}
                className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-foreground/50 block mb-2">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="(602) 555-1234"
                  className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-foreground/50 block mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="contact@business.com"
                  className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-foreground/50 block mb-2">Website</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                  placeholder="https://business.com"
                  className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-foreground/50 block mb-2">Zip Code</label>
                <input
                  type="text"
                  value={form.zip_code}
                  onChange={(e) => setForm((prev) => ({ ...prev, zip_code: e.target.value }))}
                  placeholder="85001"
                  className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs tracking-[0.15em] uppercase text-foreground/50 block mb-3">Waste Types Handled</label>
              <div className="flex flex-wrap gap-2">
                {WASTE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleWasteType(type)}
                    className={`px-4 py-2 text-sm tracking-[0.05em] uppercase transition-colors ${
                      form.waste_types.includes(type)
                        ? "bg-accent text-background"
                        : "border border-border text-foreground/60 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[0.5px] bg-border" />

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Check size={16} />
              )}
              {existingId ? "Update Profile" : "Create Profile"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}