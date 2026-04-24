import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { listShortlists, removeShortlist } from "../lib/api";
import { Reveal } from "../components/ui/Reveal";
import { AnimatedNumber } from "../components/ui/AnimatedNumber";

export function ShortlistsPage() {
  const queryClient = useQueryClient();
  const shortlistQuery = useQuery({
    queryKey: ["shortlists"],
    queryFn: listShortlists,
  });

  const removeMutation = useMutation({
    mutationFn: (propertyId: string) => removeShortlist(propertyId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shortlists"] }),
  });

  const items = shortlistQuery.data ?? [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Reveal>
        <section
          className="relative overflow-hidden rounded-3xl p-8"
          style={{ background: "var(--gradient-amber)" }}
        >
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20"
            style={{ background: "var(--on-primary)", filter: "blur(40px)" }}
          />
          <div className="relative z-10">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.60)", letterSpacing: "0.15em" }}
            >
              Your Collection
            </p>
            <h1 className="mt-2 text-3xl font-black" style={{ color: "var(--on-primary)" }}>
              Saved Listings
            </h1>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
              <AnimatedNumber value={items.length} /> properties you&apos;ve shortlisted
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal className="mt-8" delayMs={60}>
        {shortlistQuery.isLoading && (
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 skeleton-shimmer" />
            ))}
          </div>
        )}

        {items.length === 0 && !shortlistQuery.isLoading && (
          <div
            className="rounded-3xl p-12 text-center"
            style={{ background: "var(--surface-container-low)" }}
          >
            <p className="text-5xl">🏠</p>
            <p className="mt-4 text-xl font-black" style={{ color: "var(--on-surface)" }}>
              No saved listings yet
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--outline)" }}>
              Browse and tap the heart icon to save listings
            </p>
            <Link to="/discover" className="btn-primary mt-6 inline-flex">
              Explore Listings
            </Link>
          </div>
        )}

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.shortlist_id} className="glass-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--on-surface)" }}>
                    Property: {item.property_id.slice(0, 12)}...
                  </p>
                  <p className="mt-1 text-xs" style={{ color: "var(--outline)" }}>
                    Saved on {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => removeMutation.mutate(item.property_id)}
                  className="rounded-full px-3 py-1.5 text-xs font-bold transition-colors"
                  style={{
                    background: "rgba(186, 26, 26, 0.08)",
                    color: "var(--error)",
                  }}
                >
                  Remove
                </button>
              </div>
              <Link
                to={`/properties/${item.property_id}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all hover:gap-3"
                style={{
                  background: "var(--surface-container)",
                  color: "var(--on-surface)",
                }}
              >
                View Details <span style={{ fontSize: "10px" }}>→</span>
              </Link>
            </article>
          ))}
        </div>
      </Reveal>
    </main>
  );
}
