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

const POPULAR_MODELS_BY_MAKE: Record<
  Exclude<PopularMake, "Other">,
  string[]
> = {
  Toyota: [
    "Camry",
    "Corolla",
    "RAV4",
    "Highlander",
    "Tacoma",
    "Tundra",
    "4Runner",
    "Prius",
    "Sienna",
    "Avalon",
  ],
  Honda: [
    "Civic",
    "Accord",
    "CR-V",
    "HR-V",
    "Pilot",
    "Odyssey",
    "Ridgeline",
    "Fit",
    "Passport",
  ],
  Ford: [
    "F-150",
    "Escape",
    "Explorer",
    "Edge",
    "Bronco",
    "Ranger",
    "Mustang",
    "Expedition",
    "Fusion",
  ],
  Chevrolet: [
    "Silverado 1500",
    "Equinox",
    "Tahoe",
    "Suburban",
    "Traverse",
    "Malibu",
    "Colorado",
    "Camaro",
    "Blazer",
  ],
  Nissan: [
    "Altima",
    "Sentra",
    "Rogue",
    "Pathfinder",
    "Murano",
    "Frontier",
    "Maxima",
    "Versa",
  ],
  Hyundai: [
    "Elantra",
    "Sonata",
    "Tucson",
    "Santa Fe",
    "Kona",
    "Palisade",
    "Accent",
  ],
  Kia: ["Forte", "K5", "Sportage", "Sorento", "Telluride", "Soul", "Rio"],
  Jeep: ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade", "Gladiator"],
  Subaru: ["Outback", "Forester", "Crosstrek", "Impreza", "Legacy", "Ascent", "WRX"],
  Volkswagen: ["Jetta", "Passat", "Tiguan", "Atlas", "Golf", "Taos"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "X1", "4 Series", "7 Series"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "A-Class", "S-Class"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
};

const YEARS: string[] = Array.from({ length: 28 }, (_, i) =>
  String(new Date().getFullYear() - i)
);

function normalizeVin(raw: string) {
  return (raw || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .replace(/[IOQ]/g, "");
}

function clampText(s: string, max = 2000) {
  if (!s) return "";
  return s.length > max ? s.slice(0, max) + "…" : s;
}

async function safeCopy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function caseInsensitiveFind(options: string[], target: string) {
  const t = (target || "").trim().toLowerCase();
  if (!t) return null;
  return options.find((o) => o.toLowerCase() === t) ?? null;
}

function RoundAction({
  title,
  subtitle,
  emoji,
  onClick,
  disabled,
  tone = "neutral",
}: {
  title: string;
  subtitle?: string;
  emoji: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "neutral" | "good" | "warn";
}) {
  const toneClass =
    tone === "good"
      ? "border-emerald-400/25 bg-emerald-500/10 hover:bg-emerald-500/15"
      : tone === "warn"
      ? "border-red-400/25 bg-red-500/10 hover:bg-red-500/15"
      : "border-white/10 bg-white/10 hover:bg-white/15";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex flex-col items-center gap-2 disabled:opacity-60"
    >
      <div
        className={[
          "relative grid h-16 w-16 place-items-center rounded-full border",
          toneClass,
          "shadow-[0_14px_28px_rgba(0,0,0,0.55)]",
          "ring-1 ring-white/10",
          "after:absolute after:inset-0 after:rounded-full after:pointer-events-none",
          "after:bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.22),transparent_55%)] after:opacity-80",
          "before:absolute before:inset-[-1px] before:rounded-full before:pointer-events-none",
          "before:bg-[conic-gradient(from_180deg,rgba(255,255,255,0.10),transparent_35%,rgba(255,255,255,0.08),transparent_70%,rgba(255,255,255,0.10))] before:opacity-60",
          "transition-transform duration-150",
          "group-hover:-translate-y-[1px] group-active:translate-y-[1px]",
        ].join(" ")}
      >
        <span className="text-xl">{emoji}</span>
        <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]" />
      </div>

      <div className="text-center">
        <div className="text-sm font-extrabold text-white/90 leading-tight">{title}</div>
        {subtitle ? (
          <div className="mt-0.5 text-xs text-white/60 leading-tight">{subtitle}</div>
        ) : null}
      </div>
    </button>
  );
}

function GoldShineButton({
  children,
  onClick,
  disabled,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}) {
  const base =
    "relative w-full rounded-2xl px-5 py-4 text-lg font-extrabold disabled:opacity-60 transition-transform duration-150 active:translate-y-[1px]";

  const surface =
    variant === "primary"
      ? "bg-emerald-500/25 border border-emerald-500/30 hover:bg-emerald-500/30"
      : "bg-white/10 border border-white/10 hover:bg-white/15";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        base,
        surface,
        "shadow-[0_14px_28px_rgba(0,0,0,0.55)]",
        "ring-1 ring-white/10",
        // Gold rim + glow
        "outline-none",
        "after:absolute after:inset-[-2px] after:rounded-[18px] after:pointer-events-none",
        "after:bg-[conic-gradient(from_180deg,rgba(255,215,0,0.35),rgba(255,215,0,0.05),transparent_40%,rgba(255,215,0,0.22),transparent_70%,rgba(255,215,0,0.35))]",
        "after:opacity-70",
        "after:blur-[1px]",
        // Shine sweep (subtle)
        "before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none",
        "before:bg-[linear-gradient(110deg,transparent_0%,rgba(255,215,0,0.15)_35%,rgba(255,255,255,0.18)_50%,rgba(255,215,0,0.12)_65%,transparent_100%)]",
        "before:opacity-0 hover:before:opacity-100",
        "before:transition-opacity before:duration-300",
      ].join(" ")}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]" />
    </button>
  );
}

export default function Page() {
  // BUSINESS INFO
  const BUSINESS_NAME = "Python Auto Repair";
  const BUSINESS_PHONE_PRETTY = "(561) 371-5673";
  const BUSINESS_PHONE_E164 = "+15613715673";
  const BUSINESS_EMAIL = "info@pythonautorepair.com";
  const BUSINESS_ADDRESS = "1114 NE 4th Ave, Fort Lauderdale, FL 33304";

  const googleMapsLink = useMemo(
    () =>
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        BUSINESS_ADDRESS
      )}`,
    [BUSINESS_ADDRESS]
  );

  // CUSTOMER INFO (optional)
  const [name, setName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [location, setLocation] = useState("");

  // VEHICLE
  const [vin, setVin] = useState("");
  const [noVinAccess, setNoVinAccess] = useState(false);
  const [year, setYear] = useState("");
  const [make, setMake] = useState<PopularMake | "">("");

  // Model dropdown + Other
  const [modelChoice, setModelChoice] = useState<string>("");
  const [modelOther, setModelOther] = useState<string>("");

  // VIN HELP + SCANNER
  const [showVinHelp, setShowVinHelp] = useState(false);
  const [showVinScanner, setShowVinScanner] = useState(false);
  const [vinBusy, setVinBusy] = useState(false);
  const [vinError, setVinError] = useState<string | null>(null);

  // CONTACT MODALS
  const [contactModal, setContactModal] = useState<null | "phone" | "email" | "address">(null);

  // PHOTOS + DESCRIPTION
  const [photos, setPhotos] = useState<File[]>([]);
  const [damageDescription, setDamageDescription] = useState("");

  // SUBMIT
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // UI feedback
  const [toast, setToast] = useState<string | null>(null);

  // FLOW GATING
  const [showManualVinInput, setShowManualVinInput] = useState(false);
  const [vinVerified, setVinVerified] = useState(false);

  const albumVinRef = useRef<HTMLInputElement | null>(null);
  const cameraVinRef = useRef<HTMLInputElement | null>(null);
  const cameraDamageRef = useRef<HTMLInputElement | null>(null);
  const uploadDamageRef = useRef<HTMLInputElement | null>(null);

  const modelOptions = useMemo(() => {
    if (!make || make === "Other") return ["Other"];
    const list = POPULAR_MODELS_BY_MAKE[make as Exclude<PopularMake, "Other">] || [];
    return [...list, "Other"];
  }, [make]);

  const selectedModel = useMemo(() => {
    if (!modelChoice) return "";
    if (modelChoice === "Other") return (modelOther || "").trim();
    return modelChoice;
  }, [modelChoice, modelOther]);

  const hasManualVehicle = useMemo(() => Boolean(year && make && selectedModel), [year, make, selectedModel]);
  const canUploadPhotos = useMemo(
    () => (!noVinAccess && vinVerified) || (noVinAccess && hasManualVehicle),
    [noVinAccess, vinVerified, hasManualVehicle]
  );

  const hasPhotos = useMemo(() => photos.length > 0, [photos]);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1600);
  }

  async function doCopy(text: string, label: string) {
    const ok = await safeCopy(text);
    showToast(ok ? `${label} copied` : "Copy failed");
  }

  function resetManualVehicleFields() {
    setYear("");
    setMake("");
    setModelChoice("");
    setModelOther("");
  }

  function setMakeAndPopularModel(decodedMake: string, decodedModel: string) {
    const matchedMake =
      POPULAR_MAKES.find((m) => m.toLowerCase() === decodedMake.toLowerCase()) || "Other";
    setMake(matchedMake as PopularMake);

    if (matchedMake && matchedMake !== "Other") {
      const opts = [
        ...(POPULAR_MODELS_BY_MAKE[matchedMake as Exclude<PopularMake, "Other">] || []),
        "Other",
      ];
      const found = caseInsensitiveFind(opts, decodedModel);
      if (found && found !== "Other") {
        setModelChoice(found);
        setModelOther("");
      } else {
        setModelChoice("Other");
        setModelOther(decodedModel || "");
      }
    } else {
      setModelChoice("Other");
      setModelOther(decodedModel || "");
    }
  }

  async function decodeVinAndPopulate(v: string) {
    const cleaned = normalizeVin(v);
    if (cleaned.length !== 17) throw new Error("VIN must be 17 characters.");

    const res = await fetch("/api/vin/decode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vin: cleaned }),
    });

    const data = await res.json();
    if (!res.ok || !data?.ok) throw new Error(data?.error || "VIN decode failed.");

    setVin(cleaned);
    setYear(String(data.year || ""));

    const decodedMake = String(data.make || "");
    const decodedModel = String(data.model || "");
    setMakeAndPopularModel(decodedMake, decodedModel);

    setVinVerified(true);
    setShowManualVinInput(false);
  }

  async function extractVinFromImage(file: File): Promise<string> {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const res = await fetch("/api/vin/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64: base64,
        mimeType: file.type || "image/jpeg",
      }),
    });

    const data = await res.json();
    if (!res.ok || !data?.ok) throw new Error(data?.error || "Could not read VIN from image.");
    return String(data.vin || "");
  }

  async function handleVinFromImage(file: File) {
    setVinError(null);
    setVinBusy(true);
    try {
      const extracted = await extractVinFromImage(file);
      await decodeVinAndPopulate(extracted);
      setNoVinAccess(false);
      setShowVinScanner(false);
    } catch (e: any) {
      setVinError(e?.message || "VIN scan failed.");
    } finally {
      setVinBusy(false);
    }
  }

  function goManualVehicle() {
    setNoVinAccess(true);
    setVinError(null);
    setVin("");
    setVinVerified(false);
    setShowManualVinInput(false);
    resetManualVehicleFields();
    setPhotos([]);
    setDamageDescription("");
  }

  function clearVinAndVehicle() {
    setVin("");
    setVinError(null);
    setNoVinAccess(false);
    setVinVerified(false);
    setShowManualVinInput(false);
    resetManualVehicleFields();
    setPhotos([]);
    setDamageDescription("");
  }

  async function submitEstimate() {
    setSubmitError(null);
    setResult(null);

    if (!canUploadPhotos) {
      setSubmitError("Complete the VIN step first.");
      return;
    }

    if (photos.length === 0) {
      setSubmitError("Please add at least one damage photo first.");
      return;
    }

    if (!noVinAccess) {
      if (!vinVerified) {
        setSubmitError("Please verify the VIN first (scan/album/manual lookup).");
        return;
      }
    } else {
      if (!hasManualVehicle) {
        setSubmitError("Please select Year, Make, and Model.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim() || undefined,
        phone: customerPhone.trim() || undefined,
        location: location.trim() || undefined,
        vin: !noVinAccess && vin ? normalizeVin(vin) : undefined,
        year: year || undefined,
        make: make || undefined,
        model: selectedModel || undefined,
        damageDescription: clampText(damageDescription, 2000) || undefined,
        // NOTE: you’re already storing photos client-side; uploading would happen in /api/estimate if implemented
      };

      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Estimate failed.");

      setResult(data);
    } catch (e: any) {
      setSubmitError(e?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const heroMinHeight = "min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]";

  return (
    <main className="min-h-screen bg-[#050b08] text-white">
      <div className="relative pb-28">
        {/* HERO BACKGROUND */}
        <div className="absolute inset-0">
          <img
            src="/images/classic_car_1.jpg"
            alt="Classic car"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.22),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.16),transparent_45%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.10),rgba(5,11,8,0.96))]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 pt-10 sm:pt-14">
          <div className={`${heroMinHeight} flex flex-col justify-center`}>
            <header className="flex flex-col items-center gap-5 text-center">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                  {BUSINESS_NAME}
                </h1>
              </div>

              <p className="max-w-2xl text-white/85">
                Step-by-step: VIN → photos → optional details → fast estimate range.
              </p>
            </header>
          </div>

          {/* CARD */}
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-sm sm:p-7">
            {/* CUSTOMER (OPTIONAL) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm text-white/70">Name (optional)</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-emerald-400/40"
                  placeholder="John"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="text-sm text-white/70">Phone (optional)</label>
                <input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-emerald-400/40"
                  placeholder="+1 561..."
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="text-sm text-white/70">City/Zip (optional)</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-emerald-400/40"
                  placeholder="Fort Lauderdale, 33304"
                  disabled={submitting}
                />
              </div>
            </div>

            {/* VIN SECTION */}
            <div id="vin-section" className="mt-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">Vehicle Identification</h2>
                  <p className="text-sm text-white/60">Choose one way to provide the VIN.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowVinHelp(true)}
                  className="text-sm underline text-white/60 hover:text-white"
                >
                  Don’t know where to find the VIN?
                </button>
              </div>

              {!noVinAccess ? (
                <>
                  {/* ROUND VIN ACTIONS */}
                  <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-5">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <RoundAction
                        emoji="📷"
                        title="Scanner"
                        subtitle="Next to the vehicle?"
                        onClick={() => setShowVinScanner(true)}
                        disabled={vinBusy || submitting}
                        tone="good"
                      />

                      <input
                        ref={albumVinRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleVinFromImage(f);
                          e.currentTarget.value = "";
                        }}
                        disabled={vinBusy || submitting}
                      />
                      <RoundAction
                        emoji="🖼️"
                        title="Album"
                        subtitle="Registration/insurance photo?"
                        onClick={() => albumVinRef.current?.click()}
                        disabled={vinBusy || submitting}
                      />

                      <RoundAction
                        emoji="⌨️"
                        title="Type VIN"
                        subtitle="Manual entry"
                        onClick={() => setShowManualVinInput((v) => !v)}
                        disabled={vinBusy || submitting}
                      />

                      <RoundAction
                        emoji="🚫"
                        title="Can't access"
                        subtitle="the VIN?"
                        onClick={goManualVehicle}
                        disabled={vinBusy || submitting}
                        tone="warn"
                      />
                    </div>

                    {vinBusy ? (
                      <div className="mt-4 text-center text-sm text-white/60">
                        Working… (reading VIN)
                      </div>
                    ) : null}
                  </div>

                  {/* MANUAL VIN INPUT (HIDDEN until Type VIN is pressed) */}
                  {showManualVinInput ? (
                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="text-sm text-white/70">Enter VIN manually</label>
                        <input
                          id="vin-input"
                          value={vin}
                          onChange={(e) => setVin(e.target.value)}
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-emerald-400/40 font-mono"
                          placeholder="17 characters"
                          disabled={vinBusy || submitting}
                        />
                      </div>

                      <div className="sm:col-span-1 flex items-end">
                        <button
                          type="button"
                          onClick={async () => {
                            setVinError(null);
                            setVinBusy(true);
                            try {
                              await decodeVinAndPopulate(vin);
                              setNoVinAccess(false);
                              // Move them forward
                              showToast("VIN verified");
                              window.setTimeout(() => scrollTo("photos-section"), 250);
                            } catch (e: any) {
                              setVinError(e?.message || "VIN lookup failed.");
                            } finally {
                              setVinBusy(false);
                            }
                          }}
                          className="w-full rounded-2xl border border-white/10 bg-emerald-500/20 px-4 py-3 font-semibold hover:bg-emerald-500/25 disabled:opacity-60 shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
                          disabled={vinBusy || submitting}
                        >
                          VIN Lookup
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {vinError ? (
                    <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                      {vinError}
                    </div>
                  ) : null}

                  {vinVerified ? (
                    <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                      VIN: <span className="font-mono font-semibold">{normalizeVin(vin)}</span>
                      {year && make && selectedModel ? (
                        <div className="mt-1 text-white/80">
                          Vehicle: <b>{year} {make} {selectedModel}</b>
                        </div>
                      ) : null}
                      <button
                        type="button"
                        className="mt-2 text-sm underline text-white/70 hover:text-white"
                        onClick={clearVinAndVehicle}
                        disabled={vinBusy || submitting}
                      >
                        Clear and start over
                      </button>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="mt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold">Vehicle Details</h3>
                      <p className="text-sm text-white/60">Select Year, Make, and Model.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setNoVinAccess(false);
                        setSubmitError(null);
                      }}
                      className="text-sm underline text-white/60 hover:text-white"
                      disabled={submitting || vinBusy}
                    >
                      I can scan the VIN
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="text-sm text-white/70">Year</label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-emerald-400/40"
                        disabled={submitting}
                      >
                        <option value="">Select</option>
                        {YEARS.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-white/70">Make</label>
                      <select
                        value={make}
                        onChange={(e) => {
                          const newMake = e.target.value as PopularMake;
                          setMake(newMake);
                          setModelChoice("");
                          setModelOther("");
                        }}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-emerald-400/40"
                        disabled={submitting}
                      >
                        <option value="">Select</option>
                        {POPULAR_MAKES.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-white/70">Model</label>
                      <select
                        value={modelChoice}
                        onChange={(e) => {
                          const v = e.target.value;
                          setModelChoice(v);
                          if (v !== "Other") setModelOther("");
                        }}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-emerald-400/40"
                        disabled={submitting || !make}
                      >
                        <option value="">Select</option>
                        {modelOptions.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>

                      {modelChoice === "Other" ? (
                        <input
                          value={modelOther}
                          onChange={(e) => setModelOther(e.target.value)}
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-emerald-400/40"
                          placeholder="Enter model (example: CX-5, Silverado 2500HD, etc.)"
                          disabled={submitting}
                        />
                      ) : null}
                    </div>
                  </div>

                  {/* Helpful nudge once manual vehicle is complete */}
                  {hasManualVehicle ? (
                    <div className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                      Vehicle set. Next: upload damage photos.
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* PHOTOS SECTION (HIDDEN UNTIL VIN verified OR manual vehicle complete) */}
            {canUploadPhotos ? (
              <div id="photos-section" className="mt-7">
                <h2 className="text-lg font-bold">Photos</h2>
                <p className="text-sm text-white/60">Add photos of the damaged areas.</p>

                <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <input
                      ref={cameraDamageRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setPhotos((prev) => [...prev, f]);
                        e.currentTarget.value = "";
                      }}
                      disabled={submitting}
                    />
                    <RoundAction
                      emoji="📸"
                      title="Pictures"
                      subtitle="of the damages"
                      onClick={() => cameraDamageRef.current?.click()}
                      disabled={submitting}
                      tone="good"
                    />

                    <input
                      ref={uploadDamageRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length) setPhotos((prev) => [...prev, ...files]);
                        e.currentTarget.value = "";
                      }}
                      disabled={submitting}
                    />
                    <RoundAction
                      emoji="🗂️"
                      title="Upload"
                      subtitle="from album"
                      onClick={() => uploadDamageRef.current?.click()}
                      disabled={submitting}
                    />

                    <RoundAction
                      emoji="🧹"
                      title="Clear"
                      subtitle="photos"
                      onClick={() => setPhotos([])}
                      disabled={submitting || !photos.length}
                      tone="warn"
                    />

                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-sm font-extrabold text-white/90">{photos.length}</div>
                      <div className="text-xs text-white/60 leading-tight">
                        photo{photos.length === 1 ? "" : "s"} selected
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* DAMAGE DETAILS (ONLY AFTER PHOTOS EXIST) */}
            {canUploadPhotos && hasPhotos ? (
              <div className="mt-7">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-lg font-bold">Damage Details</h2>
                  <span className="text-xs text-white/55">(optional)</span>
                </div>
                <p className="text-sm text-white/60">
                  If you want, add notes that help us estimate faster.
                </p>

                <textarea
                  value={damageDescription}
                  onChange={(e) => setDamageDescription(e.target.value)}
                  className="mt-3 w-full min-h-[120px] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-emerald-400/40"
                  placeholder="Example: Front bumper cracked, hood bent, passenger headlight broken..."
                  disabled={submitting}
                />
              </div>
            ) : null}

            {/* STEP CTA + FINAL SUBMIT */}
            <div className="mt-7">
              {!canUploadPhotos ? (
                <GoldShineButton
                  variant="secondary"
                  disabled={submitting || vinBusy}
                  onClick={() => {
                    setSubmitError(null);
                    showToast("Complete the VIN step first");
                    scrollTo("vin-section");
                  }}
                >
                  Complete VIN Step
                </GoldShineButton>
              ) : !hasPhotos ? (
                <GoldShineButton
                  variant="secondary"
                  disabled={submitting || vinBusy}
                  onClick={() => {
                    setSubmitError(null);
                    showToast("Add damage photos to continue");
                    scrollTo("photos-section");
                  }}
                >
                  Proceed to Photos
                </GoldShineButton>
              ) : (
                <GoldShineButton
                  variant="primary"
                  disabled={submitting || vinBusy}
                  onClick={submitEstimate}
                >
                  {submitting ? "Sending..." : "Python Fast Estimates"}
                </GoldShineButton>
              )}

              {submitError ? (
                <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                  {submitError}
                </div>
              ) : null}

              {result?.ok ? (
                <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <div className="font-bold text-emerald-100">Submitted</div>
                  {result?.estimate?.price?.totalLow != null &&
                  result?.estimate?.price?.totalHigh != null ? (
                    <div className="mt-2 text-white/80">
                      Estimated total:{" "}
                      <span className="font-extrabold">
                        ${Number(result.estimate.price.totalLow).toLocaleString()}–$
                        {Number(result.estimate.price.totalHigh).toLocaleString()}
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <footer className="mt-8 pb-6 text-center text-xs text-white/55">
            Estimates are preliminary and may change after inspection.
          </footer>
        </div>

        {/* BOTTOM CONTACT DOCK */}
        <div className="fixed bottom-4 left-1/2 z-[75] w-[min(560px,calc(100vw-2rem))] -translate-x-1/2">
          <div className="rounded-3xl border border-white/10 bg-black/70 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.65)]">
            <div className="grid grid-cols-3 gap-2 p-2">
              <button
                type="button"
                onClick={() => setContactModal("phone")}
                className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-extrabold hover:bg-white/15 shadow-[0_10px_22px_rgba(0,0,0,0.45)]"
              >
                Call
              </button>
              <button
                type="button"
                onClick={() => setContactModal("email")}
                className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-extrabold hover:bg-white/15 shadow-[0_10px_22px_rgba(0,0,0,0.45)]"
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setContactModal("address")}
                className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-extrabold hover:bg-white/15 shadow-[0_10px_22px_rgba(0,0,0,0.45)]"
              >
                Get Directions
              </button>
            </div>
          </div>
        </div>

        {/* CONTACT ACTION MODAL */}
        {contactModal ? (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setContactModal(null)} />
            <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#07110b] p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold">
                    {contactModal === "phone"
                      ? "Call"
                      : contactModal === "email"
                      ? "Email"
                      : "Directions"}
                  </h3>
                  <p className="mt-1 text-sm text-white/60 break-words">
                    {contactModal === "phone"
                      ? BUSINESS_PHONE_PRETTY
                      : contactModal === "email"
                      ? BUSINESS_EMAIL
                      : BUSINESS_ADDRESS}
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15"
                  onClick={() => setContactModal(null)}
                >
                  Close
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-2">
                {contactModal === "phone" ? (
                  <>
                    <a
                      href={`tel:${BUSINESS_PHONE_E164}`}
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center text-sm font-extrabold hover:bg-white/15"
                    >
                      Call Now
                    </a>
                    <a
                      href={`sms:${BUSINESS_PHONE_E164}`}
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center text-sm font-extrabold hover:bg-white/15"
                    >
                      Text
                    </a>
                    <button
                      type="button"
                      onClick={() => doCopy(BUSINESS_PHONE_PRETTY, "Phone")}
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-extrabold hover:bg-white/15"
                    >
                      Copy Number
                    </button>
                  </>
                ) : null}

                {contactModal === "email" ? (
                  <>
                    <a
                      href={`mailto:${BUSINESS_EMAIL}`}
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center text-sm font-extrabold hover:bg-white/15"
                    >
                      Email Now
                    </a>
                    <button
                      type="button"
                      onClick={() => doCopy(BUSINESS_EMAIL, "Email")}
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-extrabold hover:bg-white/15"
                    >
                      Copy Email
                    </button>
                  </>
                ) : null}

                {contactModal === "address" ? (
                  <>
                    <a
                      href={googleMapsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center text-sm font-extrabold hover:bg-white/15"
                    >
                      Open Directions
                    </a>
                    <button
                      type="button"
                      onClick={() => doCopy(BUSINESS_ADDRESS, "Address")}
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-extrabold hover:bg-white/15"
                    >
                      Copy Address
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* TOAST */}
        {toast ? (
          <div className="fixed bottom-24 left-1/2 z-[95] -translate-x-1/2 rounded-full border border-white/10 bg-black/80 px-4 py-2 text-sm text-white shadow-lg">
            {toast}
          </div>
        ) : null}

        {/* VIN HELP MODAL */}
        {showVinHelp ? (
          <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowVinHelp(false)} />
            <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#07110b] p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold">Where to find the VIN</h3>
                  <p className="mt-1 text-sm text-white/60">
                    Most vehicles have the VIN in at least two places.
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15"
                  onClick={() => setShowVinHelp(false)}
                >
                  Close
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="font-semibold">Windshield (driver side)</div>
                  <div className="mt-2 text-sm text-white/70">
                    Look through the windshield at the dashboard corner on the driver side.
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="font-semibold">Driver door jamb sticker</div>
                  <div className="mt-2 text-sm text-white/70">
                    Open the driver door and check the sticker on the pillar or door edge.
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="font-semibold">Documents</div>
                  <div className="mt-2 text-sm text-white/70">
                    Registration, insurance card, or title often lists the VIN.
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="font-semibold">Engine bay / frame</div>
                  <div className="mt-2 text-sm text-white/70">
                    Some vehicles have VIN stamps under the hood or near strut towers.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* VIN SCANNER MODAL */}
        {showVinScanner ? (
          <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => (vinBusy ? null : setShowVinScanner(false))}
            />
            <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#07110b] p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold">VIN Scanner</h3>
                  <p className="mt-1 text-sm text-white/60">Take a clear photo of the VIN.</p>
                </div>
                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15 disabled:opacity-60"
                  disabled={vinBusy}
                  onClick={() => setShowVinScanner(false)}
                >
                  Close
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                <input
                  ref={cameraVinRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleVinFromImage(f);
                    e.currentTarget.value = "";
                  }}
                  disabled={vinBusy}
                />

                <button
                  type="button"
                  onClick={() => cameraVinRef.current?.click()}
                  className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-4 font-extrabold border border-white/10 shadow-[0_14px_28px_rgba(0,0,0,0.55)] ${
                    vinBusy ? "bg-white/5 text-white/40 cursor-not-allowed" : "bg-white/10 hover:bg-white/15"
                  }`}
                  disabled={vinBusy}
                >
                  {vinBusy ? "Reading..." : "Take VIN Photo"}
                </button>

                {vinError ? (
                  <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                    {vinError}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
