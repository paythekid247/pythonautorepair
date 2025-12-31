"use client";

import React, { useMemo, useRef, useState } from "react";

type PopularMake =
  | "Toyota"
  | "Honda"
  | "Ford"
  | "Chevrolet"
  | "Nissan"
  | "Hyundai"
  | "Kia"
  | "Jeep"
  | "Subaru"
  | "Volkswagen"
  | "BMW"
  | "Mercedes-Benz"
  | "Tesla"
  | "Other";

const POPULAR_MAKES: PopularMake[] = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "Nissan",
  "Hyundai",
  "Kia",
  "Jeep",
  "Subaru",
  "Volkswagen",
  "BMW",
  "Mercedes-Benz",
  "Tesla",
  "Other",
];

const MODELS_BY_MAKE: Record<Exclude<PopularMake, "Other">, string[]> = {
  Toyota: ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "Tundra", "Prius", "Sienna"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "HR-V", "Odyssey"],
  Ford: ["F-150", "Escape", "Explorer", "Edge", "Mustang", "Bronco"],
  Chevrolet: ["Silverado", "Equinox", "Tahoe", "Suburban", "Malibu", "Traverse"],
  Nissan: ["Altima", "Sentra", "Rogue", "Pathfinder", "Frontier"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Palisade"],
  Kia: ["Forte", "K5", "Sportage", "Sorento", "Telluride"],
  Jeep: ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Gladiator"],
  Subaru: ["Outback", "Forester", "Crosstrek", "Impreza", "Ascent"],
  Volkswagen: ["Jetta", "Passat", "Tiguan", "Atlas", "Golf"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "X1"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "A-Class"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
};

function yearsList(minYear = 1990) {
  const now = new Date().getFullYear();
  const arr: number[] = [];
  for (let y = now + 1; y >= minYear; y--) arr.push(y);
  return arr;
}

type MakeState = "" | PopularMake;
type ContactMode = "call" | "email" | "directions" | null;

export default function Page() {
  const SHOP_PHONE_DISPLAY = "(561) 371-5673";
  const SHOP_PHONE_TEL = "+15613715673";
  const SHOP_EMAIL = "info@pythonautorepair.com";
  const SHOP_ADDRESS = "1114 NE 4th Ave, Fort Lauderdale, FL 33304";
  const SHOP_MAPS_URL =
    "https://www.google.com/maps/search/?api=1&query=1114%20NE%204th%20Ave%2C%20Fort%20Lauderdale%2C%20FL%2033304";

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Contact modal
  const [contactMode, setContactMode] = useState<ContactMode>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Lead fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Vehicle fields
  const [year, setYear] = useState<number | "">("");
  const [make, setMake] = useState<MakeState>("");
  const [model, setModel] = useState("");
  const [otherMake, setOtherMake] = useState("");
  const [otherModel, setOtherModel] = useState("");

  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const modelOptions = useMemo(() => {
    if (make === "" || make === "Other") return [];
    return MODELS_BY_MAKE[make];
  }, [make]);

  function openCameraOrPicker() {
    fileInputRef.current?.click();
  }

  function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const next = [...photos, ...files].slice(0, 8);
    setPhotos(next);
    e.target.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function resetForm() {
    setName("");
    setPhone("");
    setYear("");
    setMake("");
    setModel("");
    setOtherMake("");
    setOtherModel("");
    setNotes("");
    setPhotos([]);
  }

  function submitLead(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const resolvedMake = make === "Other" ? otherMake.trim() : make;
  const resolvedModel = make === "Other" ? otherModel.trim() : model;

  const canSubmit =
    name.trim().length > 0 &&
    phone.trim().length >= 7 &&
    year !== "" &&
    (resolvedMake?.toString().trim().length || 0) > 0 &&
    (resolvedModel?.toString().trim().length || 0) > 0;

  async function copyToClipboard(text: string, label = "Copied") {
    try {
      await navigator.clipboard.writeText(text);
      setToast(label);
      window.setTimeout(() => setToast(null), 1500);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setToast(label);
      window.setTimeout(() => setToast(null), 1500);
    }
  }

  async function shareAddress() {
    const shareText = `Python Auto Repair\n${SHOP_ADDRESS}\n${SHOP_MAPS_URL}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Python Auto Repair",
          text: `Python Auto Repair\n${SHOP_ADDRESS}`,
          url: SHOP_MAPS_URL,
        });
        return;
      } catch {
        // user cancelled or share failed; fall back to copy
      }
    }
    await copyToClipboard(shareText, "Address copied");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050A07] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#06110B] via-[#050A07] to-[#050A07]" />
        <div className="absolute -top-24 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#0E2A18]/35 blur-3xl" />
        <div className="absolute top-[30%] left-[-10%] h-[420px] w-[420px] rounded-full bg-[#0B2416]/35 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[520px] w-[520px] rounded-full bg-[#12351F]/25 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <JunglePlants />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-[#2E5A3E] bg-[#0B1B12]/95 px-4 py-2 text-sm text-white/90 shadow-lg backdrop-blur">
          {toast}
        </div>
      )}

      {/* Contact modal */}
      <ContactModal
        mode={contactMode}
        onClose={() => setContactMode(null)}
        phoneDisplay={SHOP_PHONE_DISPLAY}
        phoneTel={SHOP_PHONE_TEL}
        email={SHOP_EMAIL}
        address={SHOP_ADDRESS}
        mapsUrl={SHOP_MAPS_URL}
        onCopy={copyToClipboard}
        onShareAddress={shareAddress}
      />

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5">
        {/* Header (clean: just the buttons, no repeated text line) */}
        <header className="w-full py-5">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[#1D3B28] bg-[#07140C]">
                <span className="text-sm font-semibold text-[#E8D48A]">AI</span>
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-wide">Python Auto Repair</div>
                <div className="text-xs text-white/65">Fort Lauderdale • Fast photo estimates</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setContactMode("call")}
                className="rounded-2xl border border-[#2E5A3E] bg-[#0B1B12] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-[#0E2418]"
              >
                Call
              </button>

              <button
                type="button"
                onClick={() => setContactMode("email")}
                className="rounded-2xl border border-[#2E5A3E] bg-[#0B1B12] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-[#0E2418]"
              >
                Email
              </button>

              <button
                type="button"
                onClick={() => setContactMode("directions")}
                className="rounded-2xl border border-[#2E5A3E] bg-[#0B1B12] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-[#0E2418]"
              >
                Directions
              </button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="w-full pb-8 pt-4 text-center">
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
            Jungle-fast estimates.
            <span className="block text-[#E8D48A]">Upload. Submit. Done.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70 md:text-base">
            Works on iPhone and Android. Tap the python, add photos, and we’ll reply fast.
          </p>
        </section>

        {/* Form */}
        <section className="w-full pb-16">
          <div className="rounded-3xl border border-[#1D3B28] bg-[#07140C] p-6">
            {submitted ? (
              <div className="rounded-2xl border border-[#2E5A3E] bg-[#0B1B12] p-5 text-center">
                <div className="text-lg font-semibold text-[#E8D48A]">Submitted ✅</div>
                <p className="mt-2 text-sm text-white/75">We’ll contact you soon.</p>

                <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setContactMode("call")}
                    className="inline-flex items-center justify-center rounded-2xl bg-[#E8D48A] px-5 py-3 text-sm font-semibold text-[#0B0F0C] hover:brightness-95"
                  >
                    Contact shop
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      resetForm();
                    }}
                    className="inline-flex items-center justify-center rounded-2xl border border-[#2E5A3E] bg-[#0B1B12] px-5 py-3 text-sm font-semibold text-white/90 hover:bg-[#0E2418]"
                  >
                    New estimate
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submitLead} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Name">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-[#1D3B28] bg-[#050A07] px-4 py-3 text-sm text-white/90 placeholder:text-white/35 outline-none focus:border-[#E8D48A]/60"
                    />
                  </Field>

                  <Field label="Phone">
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(XXX) XXX-XXXX"
                      inputMode="tel"
                      className="w-full rounded-2xl border border-[#1D3B28] bg-[#050A07] px-4 py-3 text-sm text-white/90 placeholder:text-white/35 outline-none focus:border-[#E8D48A]/60"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Year">
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}
                      className="w-full rounded-2xl border border-[#1D3B28] bg-[#050A07] px-4 py-3 text-sm text-white/90 outline-none focus:border-[#E8D48A]/60"
                    >
                      <option value="">Select</option>
                      {yearsList(1990).map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Make">
                    <select
                      value={make}
                      onChange={(e) => {
                        const next = e.target.value as MakeState;
                        setMake(next);
                        setModel("");
                        setOtherMake("");
                        setOtherModel("");
                      }}
                      className="w-full rounded-2xl border border-[#1D3B28] bg-[#050A07] px-4 py-3 text-sm text-white/90 outline-none focus:border-[#E8D48A]/60"
                    >
                      <option value="">Select</option>
                      {POPULAR_MAKES.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Model">
                    {make === "Other" ? (
                      <input
                        value={otherModel}
                        onChange={(e) => setOtherModel(e.target.value)}
                        placeholder="Model"
                        className="w-full rounded-2xl border border-[#1D3B28] bg-[#050A07] px-4 py-3 text-sm text-white/90 placeholder:text-white/35 outline-none focus:border-[#E8D48A]/60"
                      />
                    ) : (
                      <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        disabled={make === ""}
                        className="w-full rounded-2xl border border-[#1D3B28] bg-[#050A07] px-4 py-3 text-sm text-white/90 outline-none disabled:opacity-50 focus:border-[#E8D48A]/60"
                      >
                        <option value="">{make ? "Select" : "Pick make first"}</option>
                        {modelOptions.map((mo) => (
                          <option key={mo} value={mo}>
                            {mo}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                </div>

                {make === "Other" && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Other make">
                      <input
                        value={otherMake}
                        onChange={(e) => setOtherMake(e.target.value)}
                        placeholder="Make"
                        className="w-full rounded-2xl border border-[#1D3B28] bg-[#050A07] px-4 py-3 text-sm text-white/90 placeholder:text-white/35 outline-none focus:border-[#E8D48A]/60"
                      />
                    </Field>
                    <div className="hidden sm:block" />
                  </div>
                )}

                <Field label="Damage notes (optional)">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Where is the damage? Is it drivable?"
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-[#1D3B28] bg-[#050A07] px-4 py-3 text-sm text-white/90 placeholder:text-white/35 outline-none focus:border-[#E8D48A]/60"
                  />
                </Field>

                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-white/85">Photos</div>
                    <div className="text-xs text-white/55">{photos.length}/8</div>
                  </div>

                  <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={openCameraOrPicker}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E8D48A] px-5 py-3 text-sm font-semibold text-[#0B0F0C] hover:brightness-95"
                    >
                      📸 Add photos
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      onChange={onFilesSelected}
                      className="hidden"
                    />

                    <div className="text-xs text-white/60">Best: 1 wide + 2 close-ups.</div>
                  </div>

                  {photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {photos.map((file, idx) => (
                        <div
                          key={`${file.name}-${idx}`}
                          className="group relative overflow-hidden rounded-2xl border border-[#1D3B28] bg-[#050A07]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt={`Uploaded ${idx + 1}`}
                            src={URL.createObjectURL(file)}
                            className="h-28 w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="absolute right-2 top-2 rounded-full border border-[#2E5A3E] bg-[#0B1B12]/90 px-2 py-1 text-xs text-white/85 opacity-0 backdrop-blur group-hover:opacity-100"
                            aria-label="Remove photo"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#E8D48A] px-6 py-4 text-sm font-semibold text-[#0B0F0C] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <PythonHeadIcon className="h-6 w-6 text-[#0B0F0C]" />
                    Submit for estimate
                  </button>

                  {!canSubmit && (
                    <div className="mt-2 text-center text-xs text-white/55">
                      Add name, phone, year, make, and model to submit.
                    </div>
                  )}

                  <div className="mt-2 text-center text-[11px] text-white/45">
                    By submitting, you agree we can contact you by call/text.
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="mt-6 text-center text-[11px] text-white/40">
            © {new Date().getFullYear()} Python Auto Repair
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-left">
      <div className="mb-2 text-xs font-semibold text-white/75">{label}</div>
      {children}
    </label>
  );
}

function PythonHeadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M20.4 10.6c0 5.2-4.2 9.4-9.4 9.4-4.9 0-8.9-3.7-9.3-8.5-.1-1.3.9-2.5 2.2-2.6 1.1-.1 2.1.6 2.4 1.7.6 2.4 2.8 4.2 5.4 4.2 3.1 0 5.7-2.6 5.7-5.7 0-1.8-.8-3.4-2.2-4.5-1.2-.9-1.3-2.6-.2-3.6 1-1 2.5-1 3.6-.1 2.1 1.6 3.4 4.1 3.4 6.7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10.7 7.8c1.2-1.7 3.4-2.9 6.1-2.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="14.8" cy="7.2" r="0.9" fill="currentColor" />
      <path d="M7.3 11.1c-.6 0-1.1.3-1.5.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function JunglePlants() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
      <svg className="absolute -top-10 -left-10 h-[320px] w-[320px] blur-[0.2px]" viewBox="0 0 300 300" fill="none">
        <path d="M40 20c30 40 30 70 5 115-16 28-8 62 18 86" stroke="rgba(232,212,138,0.18)" strokeWidth="2" />
        <path d="M65 0c25 45 20 85-8 130-15 25-10 52 10 78" stroke="rgba(75,165,110,0.18)" strokeWidth="3" />
        <path d="M20 55c45 20 70 45 92 82" stroke="rgba(70,180,120,0.12)" strokeWidth="2" />
        <path
          d="M120 70c-18 8-30 20-36 35 20 3 38-4 54-18-2-7-8-13-18-17Z"
          fill="rgba(25,90,60,0.35)"
          stroke="rgba(75,165,110,0.14)"
        />
        <path
          d="M90 125c-18 8-30 20-36 35 20 3 38-4 54-18-2-7-8-13-18-17Z"
          fill="rgba(20,70,50,0.35)"
          stroke="rgba(75,165,110,0.12)"
        />
      </svg>

      <svg className="absolute -bottom-20 -right-24 h-[520px] w-[520px] opacity-80" viewBox="0 0 520 520" fill="none">
        <path
          d="M312 468c88-76 106-193 48-287-43-70-116-104-196-90-71 12-129 63-153 135-22 66-8 145 39 204 62 78 173 101 262 38Z"
          fill="rgba(10,38,22,0.55)"
          stroke="rgba(75,165,110,0.16)"
          strokeWidth="2"
        />
        <path d="M235 146c-18 55-10 127 25 186" stroke="rgba(232,212,138,0.12)" strokeWidth="3" strokeLinecap="round" />
        <path d="M190 198c40 10 76 4 106-22" stroke="rgba(70,180,120,0.10)" strokeWidth="3" strokeLinecap="round" />
        <path d="M210 260c40 10 86 0 122-34" stroke="rgba(70,180,120,0.08)" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#06110B] to-transparent opacity-70" />
    </div>
  );
}

function ContactModal(props: {
  mode: ContactMode;
  onClose: () => void;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  address: string;
  mapsUrl: string;
  onCopy: (text: string, label?: string) => Promise<void>;
  onShareAddress: () => Promise<void>;
}) {
  const { mode, onClose, phoneDisplay, phoneTel, email, address, mapsUrl, onCopy, onShareAddress } = props;

  if (!mode) return null;

  const title = mode === "call" ? "Call" : mode === "email" ? "Email" : "Directions";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        className="w-full max-w-md rounded-3xl border border-[#1D3B28] bg-[#07140C] p-5 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold text-white/90">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#2E5A3E] bg-[#0B1B12] px-3 py-1.5 text-sm text-white/80 hover:bg-[#0E2418]"
          >
            Close
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-[#1D3B28] bg-[#050A07] p-4">
          {mode === "call" && (
            <>
              <div className="text-xs text-white/55">Phone</div>
              <div className="mt-1 text-lg font-semibold text-white/90">{phoneDisplay}</div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a
                  href={`tel:${phoneTel}`}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[#E8D48A] px-4 py-3 text-sm font-semibold text-[#0B0F0C] hover:brightness-95"
                >
                  Call now
                </a>
                <button
                  type="button"
                  onClick={() => onCopy(phoneDisplay, "Number copied")}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#2E5A3E] bg-[#0B1B12] px-4 py-3 text-sm font-semibold text-white/90 hover:bg-[#0E2418]"
                >
                  Copy
                </button>
              </div>
            </>
          )}

          {mode === "email" && (
            <>
              <div className="text-xs text-white/55">Email</div>
              <div className="mt-1 text-lg font-semibold text-white/90">{email}</div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a
                  href={`mailto:${email}`}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[#E8D48A] px-4 py-3 text-sm font-semibold text-[#0B0F0C] hover:brightness-95"
                >
                  Compose email
                </a>
                <button
                  type="button"
                  onClick={() => onCopy(email, "Email copied")}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#2E5A3E] bg-[#0B1B12] px-4 py-3 text-sm font-semibold text-white/90 hover:bg-[#0E2418]"
                >
                  Copy
                </button>
              </div>
            </>
          )}

          {mode === "directions" && (
            <>
              <div className="text-xs text-white/55">Address</div>
              <div className="mt-1 text-base font-semibold text-white/90">{address}</div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#E8D48A] px-4 py-3 text-sm font-semibold text-[#0B0F0C] hover:brightness-95"
                >
                  Open Maps
                </a>
                <button
                  type="button"
                  onClick={() => onCopy(mapsUrl, "Maps link copied")}
                  className="inline-flex items-center justify-center rounded-2xl border border-[#2E5A3E] bg-[#0B1B12] px-4 py-3 text-sm font-semibold text-white/90 hover:bg-[#0E2418]"
                >
                  Copy Maps link
                </button>
                <button
                  type="button"
                  onClick={() => onCopy(address, "Address copied")}
                  className="inline-flex items-center justify-center rounded-2xl border border-[#2E5A3E] bg-[#0B1B12] px-4 py-3 text-sm font-semibold text-white/90 hover:bg-[#0E2418]"
                >
                  Copy address
                </button>
                <button
                  type="button"
                  onClick={onShareAddress}
                  className="inline-flex items-center justify-center rounded-2xl border border-[#2E5A3E] bg-[#0B1B12] px-4 py-3 text-sm font-semibold text-white/90 hover:bg-[#0E2418]"
                >
                  Share
                </button>
              </div>

              <div className="mt-3 text-xs text-white/50">
                “Share” uses your phone’s share sheet when available (Message/WhatsApp/Telegram).
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
