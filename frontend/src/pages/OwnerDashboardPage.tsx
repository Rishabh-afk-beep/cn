import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Reveal } from "../components/ui/Reveal";
import { AnimatedNumber } from "../components/ui/AnimatedNumber";
import { createOwnerProperty, listOwnerProperties, setApiToken, updateOwnerProperty, deleteOwnerProperty, listOwnerInquiries, uploadImage } from "../lib/api";
import { useAuth } from "../lib/AuthContext";
import type { InquiryOut } from "../types";

export function OwnerDashboardPage() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  // Dev token fallback for non-auth mode
  const [devToken, setDevToken] = useState(localStorage.getItem("ownerToken") ?? "");
  const [useDevAuth, setUseDevAuth] = useState(!profile);

  const [form, setForm] = useState({
    title: "",
    property_type: "pg",
    primary_college_id: "sample-college-1",
    description: "",
    address_text: "",
    latitude: "17.39",
    longitude: "78.48",
    rent_min: "7000",
    rent_max: "9000",
    security_deposit: "5000",
    amenities: "wifi,food",
    gender: "any",
    food_available: false,
    food_menu: "",
    rules: "",
  });

  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedPropertyInquiries, setSelectedPropertyInquiries] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<InquiryOut[]>([]);

  useEffect(() => {
    if (useDevAuth && devToken) {
      setApiToken(devToken);
    }
  }, [devToken, useDevAuth]);

  const propertiesQuery = useQuery({
    queryKey: ["owner-properties"],
    queryFn: () => listOwnerProperties(),
    enabled: Boolean(profile || devToken),
  });

  const createMutation = useMutation({
    mutationFn: createOwnerProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-properties"] });
      setForm({ ...form, title: "", description: "", address_text: "" });
      setImageUrls([]);
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ propertyId, availability }: { propertyId: string; availability: string }) =>
      updateOwnerProperty(propertyId, { availability_status: availability }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["owner-properties"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOwnerProperty,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["owner-properties"] }),
  });

  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true);
    const urls: string[] = [...imageUrls];
    for (const file of Array.from(files)) {
      try {
        const result = await uploadImage(file);
        urls.push(result.url);
      } catch { /* skip failed */ }
    }
    setImageUrls(urls);
    setUploadingImages(false);
  };

  const loadInquiries = async (propertyId: string) => {
    setSelectedPropertyInquiries(propertyId);
    try {
      const data = await listOwnerInquiries(propertyId);
      setInquiries(data);
    } catch {
      setInquiries([]);
    }
  };

  const submitCreate = (event: FormEvent) => {
    event.preventDefault();
    createMutation.mutate({
      title: form.title,
      property_type: form.property_type,
      primary_college_id: form.primary_college_id,
      description: form.description,
      address_text: form.address_text,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      rent_min: Number(form.rent_min),
      rent_max: Number(form.rent_max),
      security_deposit: Number(form.security_deposit),
      amenities: form.amenities.split(",").map((item) => item.trim()).filter(Boolean),
      gender: form.gender || undefined,
      food_available: form.food_available,
      food_menu: form.food_menu || undefined,
      rules: form.rules || undefined,
      image_urls: imageUrls,
      cover_image_url: imageUrls[0] || undefined,
    });
  };

  const saveDevToken = () => {
    localStorage.setItem("ownerToken", devToken);
    setApiToken(devToken);
    queryClient.invalidateQueries({ queryKey: ["owner-properties"] });
  };

  const totalListings = propertiesQuery.data?.length ?? 0;
  const approvedListings = propertiesQuery.data?.filter((item) => item.approval_status === "approved").length ?? 0;
  const occupiedListings = propertiesQuery.data?.filter((item) => item.availability_status === "occupied").length ?? 0;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <Reveal>
        <section
          className="relative overflow-hidden rounded-3xl p-8"
          style={{ background: "var(--gradient-amber)" }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20"
            style={{ background: "var(--on-primary)", filter: "blur(40px)" }}
          />
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.60)", letterSpacing: "0.15em" }}>
              Owner Console
            </p>
            <h1 className="mt-2 text-3xl font-black" style={{ color: "var(--on-primary)" }}>
              Manage your listings with confidence
            </h1>
            <p className="mt-2 max-w-2xl text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
              Publish new inventory, track approval status, upload photos, and keep availability updated for student demand.
            </p>
          </div>
        </section>
      </Reveal>

      {/* Stats */}
      <Reveal className="mt-6" delayMs={60}>
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Listings", value: totalListings, icon: "🏠" },
            { label: "Approved", value: approvedListings, icon: "✅" },
            { label: "Occupied", value: occupiedListings, icon: "🔒" },
          ].map((stat) => (
            <article key={stat.label} className="stat-card">
              <span className="text-2xl">{stat.icon}</span>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--outline)", letterSpacing: "0.05em" }}>
                {stat.label}
              </p>
              <p className="mt-1 text-3xl font-black" style={{ color: "var(--on-surface)" }}>
                <AnimatedNumber value={stat.value} />
              </p>
            </article>
          ))}
        </section>
      </Reveal>

      {/* Dev token section */}
      {!profile && (
        <Reveal className="mt-6" delayMs={110}>
          <section className="glass-card-static p-6">
            <h2 className="font-black" style={{ color: "var(--on-surface)" }}>Owner Access Token</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--outline)" }}>
              Paste owner token generated from backend/scripts/generate_dev_tokens.py.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                value={devToken}
                onChange={(e) => setDevToken(e.target.value)}
                className="input-field"
                placeholder="Bearer token value"
              />
              <button onClick={saveDevToken} className="btn-primary flex-shrink-0">
                Use Token
              </button>
            </div>
          </section>
        </Reveal>
      )}

      {/* Create listing form */}
      <Reveal className="mt-6" delayMs={160}>
        <section className="glass-card-static p-7">
          <h2 className="text-lg font-black" style={{ color: "var(--on-surface)" }}>Create Listing</h2>
          <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={submitCreate}>
            <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <select className="input-field" value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })}>
              <option value="pg">PG</option><option value="hostel">Hostel</option><option value="single_room">Single Room</option><option value="flat">Flat</option><option value="co_living">Co-living</option>
            </select>
            <input className="input-field" placeholder="College ID" value={form.primary_college_id} onChange={(e) => setForm({ ...form, primary_college_id: e.target.value })} />
            <input className="input-field" placeholder="Address" value={form.address_text} onChange={(e) => setForm({ ...form, address_text: e.target.value })} />
            <textarea className="input-field md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            <input className="input-field" placeholder="Latitude" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
            <input className="input-field" placeholder="Longitude" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
            <input className="input-field" placeholder="Rent Min" value={form.rent_min} onChange={(e) => setForm({ ...form, rent_min: e.target.value })} />
            <input className="input-field" placeholder="Rent Max" value={form.rent_max} onChange={(e) => setForm({ ...form, rent_max: e.target.value })} />
            <input className="input-field" placeholder="Security Deposit" value={form.security_deposit} onChange={(e) => setForm({ ...form, security_deposit: e.target.value })} />
            <input className="input-field" placeholder="Amenities comma-separated" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
            <select className="input-field" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="any">Any Gender</option><option value="male">Male Only</option><option value="female">Female Only</option>
            </select>
            <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--on-surface-variant)" }}>
              <input type="checkbox" checked={form.food_available} onChange={(e) => setForm({ ...form, food_available: e.target.checked })} className="accent-amber-500" />
              Food Available
            </label>
            {form.food_available && (
              <input className="input-field md:col-span-2" placeholder="Food Menu Description" value={form.food_menu} onChange={(e) => setForm({ ...form, food_menu: e.target.value })} />
            )}
            <input className="input-field md:col-span-2" placeholder="House Rules" value={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.value })} />

            {/* Image upload */}
            <div className="md:col-span-2">
              <label className="text-sm font-bold" style={{ color: "var(--on-surface-variant)" }}>
                Photos
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="mt-2 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-xs file:font-bold"
                  style={{ color: "var(--on-surface-variant)" }}
                />
              </label>
              {uploadingImages && <p className="mt-1 text-xs" style={{ color: "var(--primary)" }}>Uploading images...</p>}
              {imageUrls.length > 0 && (
                <div className="mt-2 flex gap-2 overflow-x-auto">
                  {imageUrls.map((url, i) => (
                    <img key={i} src={url} alt="" className="h-16 w-20 rounded-xl object-cover" />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={createMutation.isPending} className="btn-primary disabled:opacity-50">
              {createMutation.isPending ? "Creating..." : "Create Property"}
            </button>
          </form>
        </section>
      </Reveal>

      {/* My Listings */}
      <Reveal className="mt-8">
        <section>
          <h2 className="text-xl font-black" style={{ color: "var(--on-surface)" }}>My Listings</h2>
          {propertiesQuery.isLoading && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[1, 2].map((i) => <div key={i} className="h-40 skeleton-shimmer" />)}
            </div>
          )}
          {propertiesQuery.isError && (
            <p className="mt-3 text-sm" style={{ color: "var(--error)" }}>Unable to load properties. Check owner token.</p>
          )}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {propertiesQuery.data?.map((item) => (
              <article key={item.property_id} className="glass-card p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black" style={{ color: "var(--on-surface)" }}>{item.title}</p>
                    <p className="text-sm" style={{ color: "var(--outline)" }}>{item.address_text || `ID: ${item.property_id}`}</p>
                  </div>
                  <span
                    className="badge"
                    style={{
                      background: item.approval_status === "approved" ? "var(--success-container)" : "var(--primary-fixed)",
                      color: item.approval_status === "approved" ? "#065f46" : "var(--on-primary-container)",
                    }}
                  >
                    {item.approval_status ?? "pending"}
                  </span>
                </div>
                <p className="mt-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                  ₹{item.rent_min}–₹{item.rent_max}/mo · {item.availability_status}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleAvailabilityMutation.mutate({ propertyId: item.property_id, availability: "available" })}
                    className="rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors"
                    style={{ background: "var(--success-container)", color: "#065f46" }}
                  >
                    Available
                  </button>
                  <button
                    onClick={() => toggleAvailabilityMutation.mutate({ propertyId: item.property_id, availability: "occupied" })}
                    className="rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors"
                    style={{ background: "var(--primary-fixed)", color: "var(--on-primary-container)" }}
                  >
                    Occupied
                  </button>
                  <button
                    onClick={() => loadInquiries(item.property_id)}
                    className="rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors"
                    style={{ background: "var(--surface-container-high)", color: "var(--on-surface)" }}
                  >
                    Inquiries
                  </button>
                  <button
                    onClick={() => { if (confirm("Delete this listing?")) deleteMutation.mutate(item.property_id); }}
                    className="rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors"
                    style={{ background: "rgba(186, 26, 26, 0.08)", color: "var(--error)" }}
                  >
                    Delete
                  </button>
                </div>

                {selectedPropertyInquiries === item.property_id && (
                  <div className="mt-4 space-y-2 rounded-xl p-4" style={{ background: "var(--surface-container-low)" }}>
                    <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--outline)", letterSpacing: "0.05em" }}>
                      Inquiries
                    </h4>
                    {inquiries.length === 0 ? (
                      <p className="text-sm" style={{ color: "var(--outline)" }}>No inquiries yet</p>
                    ) : (
                      inquiries.map((inq) => (
                        <div
                          key={inq.inquiry_id}
                          className="rounded-xl p-4 text-sm"
                          style={{ background: "var(--surface-container-lowest)" }}
                        >
                          <p className="font-bold" style={{ color: "var(--on-surface)" }}>{inq.name} · {inq.phone}</p>
                          <p style={{ color: "var(--on-surface-variant)" }}>{inq.message}</p>
                          <p className="mt-1 text-xs" style={{ color: "var(--outline)" }}>{new Date(inq.created_at).toLocaleDateString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </Reveal>
    </main>
  );
}
