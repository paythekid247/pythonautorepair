"use client";

import { useState } from "react";

export default function HomePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    files.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to get estimate");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950" />
        <div className="relative max-w-5xl mx-auto px-4 py-12 lg:py-20">
          <header className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
              Fort Lauderdale · Collision &amp; Cosmetic Repair
            </p>
            <h1 className="mt-3 text-3xl lg:text-5xl font-bold leading-tight">
              Python Auto Repair
              <span className="block text-emerald-400 text-2xl lg:text-3xl mt-2">
                From small scratches to full collision jobs.
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm lg:text-base text-slate-300">
              Local, hands-on auto body shop in Fort Lauderdale, FL. Whether
              it&apos;s bumper scuffs, cosmetic paintwork, or full-frame
              repairs, we get your car looking right again.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#estimate"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition"
              >
                Get AI Photo Estimate
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-800 transition"
              >
                Learn More
              </a>
            </div>
          </header>

          {/* QUICK INFO */}
          <div className="grid gap-4 sm:grid-cols-3 text-xs sm:text-sm">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="font-semibold text-slate-100">Location</p>
              <p className="mt-1 text-slate-300">
                970 NW 13 Terrace
                <br />
                Fort Lauderdale, FL 33311
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="font-semibold text-slate-100">Services</p>
              <p className="mt-1 text-slate-300">
                Collision repair, cosmetic bodywork, paint, panel repair, bumper
                &amp; scratch repair.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="font-semibold text-slate-100">Why Python</p>
              <p className="mt-1 text-slate-300">
                Independent shop attention with big-shop quality. No job too
                small, no project too big.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI ESTIMATE SECTION */}
      <section
        id="estimate"
        className="border-t border-slate-800 bg-slate-950/90"
      >
        <div className="max-w-5xl mx-auto px-4 py-10 lg:py-14 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <h2 className="text-xl lg:text-2xl font-semibold">
              Get a preliminary AI estimate from photos
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Use your phone to snap a few clear photos of the damage and send
              them through this form. Our AI system analyzes the images and
              gives you a rough price range. Final pricing always requires an
              in-person inspection at the shop.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-5 space-y-3 bg-slate-900/70 border border-slate-800 rounded-2xl p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  name="name"
                  placeholder="Your name"
                  className="border border-slate-700 bg-slate-900 rounded-md p-2 w-full text-sm text-slate-100 placeholder:text-slate-500"
                  required
                />
                <input
                  name="phone"
                  placeholder="Mobile number"
                  className="border border-slate-700 bg-slate-900 rounded-md p-2 w-full text-sm text-slate-100 placeholder:text-slate-500"
                  required
                />
              </div>

              <input
                name="vehicle"
                placeholder="Year / Make / Model"
                className="border border-slate-700 bg-slate-900 rounded-md p-2 w-full text-sm text-slate-100 placeholder:text-slate-500"
                required
              />

              <textarea
                name="description"
                placeholder="Briefly describe what happened and what you see (e.g. front bumper hit, fender bent, paint cracked)."
                className="border border-slate-700 bg-slate-900 rounded-md p-2 w-full text-sm text-slate-100 placeholder:text-slate-500 min-h-[80px]"
              />

              <div className="space-y-1">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  capture="environment"
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  className="w-full text-xs text-slate-300"
                />
                <p className="text-[11px] text-slate-500">
                  Tip: upload 3–6 photos from different angles and distances so
                  we can see the full damage.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-emerald-500 text-slate-900 text-sm font-semibold py-2 mt-1 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? "Analyzing photos..." : "Get AI Estimate"}
              </button>

              {error && (
                <p className="text-xs text-red-400 mt-2">
                  {error}
                </p>
              )}

              {result && (
                <div className="mt-3 border border-emerald-600/40 bg-slate-900/80 rounded-xl p-3 text-sm space-y-1">
                  <p className="font-semibold text-emerald-300">
                    Preliminary Estimate: ${result.min} – ${result.max}
                  </p>
                  <p className="text-slate-200">
                    {result.summary}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    This is a non-binding AI estimate. Final price may change
                    after an in-person inspection, parts availability, and
                    insurance review.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* SIDE INFO / ABOUT */}
          <aside className="space-y-5 text-sm">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
              <h3 className="font-semibold text-slate-100">
                How the AI estimate works
              </h3>
              <ul className="mt-2 space-y-1.5 text-slate-300 text-xs">
                <li>• We analyze your photos and description.</li>
                <li>• The system suggests a cost range based on similar jobs.</li>
                <li>• We get notified with your photos and info.</li>
                <li>• A real human follows up to confirm and schedule.</li>
              </ul>
            </div>

            <div
              id="contact"
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4"
            >
              <h3 className="font-semibold text-slate-100">
                Visit Python Auto Repair
              </h3>
              <p className="mt-2 text-slate-300">
                Drop by our Fort Lauderdale location for a full walk-around
                estimate, frame measuring, and a straight answer on what your
                car really needs.
              </p>
              <p className="mt-3 text-slate-200 text-xs leading-relaxed">
                <span className="font-semibold">Address:</span>
                <br />
                970 NW 13 Terrace
                <br />
                Fort Lauderdale, FL 33311
              </p>
              <p className="mt-2 text-slate-400 text-[11px]">
                Prefer to call or text? We can wire this app to send your
                photos directly to the shop line so the team can review and
                reach out.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Python Auto Repair · Fort Lauderdale, FL</p>
          <p>Site prototype for AI photo estimates &amp; CRM-connected intake.</p>
        </div>
      </footer>
    </main>
  );
}
