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
  Kia: [
    "Forte",
    "K5",
    "Sportage",
    "Sorento",
    "Telluride",
    "Soul",
    "Rio",
  ],
  Jeep: [
    "Wrangler",
    "Grand Cherokee",
    "Cherokee",
    "Compass",
    "Renegade",
    "Gladiator",
  ],
  Subaru: [
    "Outback",
    "Forester",
    "Crosstrek",
    "Impreza",
    "Legacy",
    "Ascent",
    "WRX",
  ],
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
  const [contactModal, setContactModal] = useState<
    null | "phone" | "email" | "address"
  >(null);

  // PHOTOS + DESCRIPTION
  const [photos, setPhotos] = useState<File[]>([]);
  const [damageDescription, setDamageDescription] = useState("");

  // SUBMIT
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // UI feedback
  const [toast, setToast] = useState<string | null>(null);

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

  const hasValidVin = useMemo(() => normalizeVin(vin).length === 17, [vin]);

  const hasManualVehicle = useMemo(() => {
    return Boolean(year && make && selectedModel);
  }, [year, make, selectedModel]);

  const canUseCamera = useMemo(
    () => !noVinAccess && hasValidVin,
    [noVinAccess, hasValidVin]
  );

  const canUploadPhotos = useMemo(
    () => (!noVinAccess && hasValidVin) || (noVinAccess && hasManualVehicle),
    [noVinAccess, hasValidVin, hasManualVehicle]
  );

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1600);
  }

  async function doCopy(text: string, label: string) {
    const ok = await safeCopy(text);
    showToast(ok ? `${label} copied` : "Copy failed");
  }

  async function doShare(payload: { title: string; text?: string; url?: string }) {
    try {
      // @ts-ignore
      if (navigator.share) {
        // @ts-ignore
        await navigator.share(payload);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  function resetManualVehicleFields() {
    setYear("");
    setMake("");
    setModelChoice("");
    setModelOther("");
  }

  function setMakeAndPopularModel(decodedMake: string, decodedModel: string) {
    // make
    const matchedMake =
      POPULAR_MAKES.find((m) => m.toLowerCase() === decodedMake.toLowerCase()) ||
      "Other";
    setMake(matchedMake as PopularMake);

    // model
    if (matchedMake && matchedMake !== "Other") {
      const opts = [...(POPULAR_MODELS_BY_MAKE[matchedMake as Exclude<PopularMake, "Other">] || []), "Other"];
      const found = caseInsensitiveFind(opts, decodedModel);
      if (found && found !== "Other") {
        setModelChoice(found);
        setModelOther("");
      } else {
        setModelChoice("Other");
        setModelOther(decodedModel || "");
      }
    } else {
      // Unknown make -> force Other model text
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
    if (!res.ok || !data?.ok)
      throw new Error(data?.error || "Could not read VIN from image.");
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
    resetManualVehicleFields();
    setPhotos([]);
  }

  function clearVinAndVehicle() {
    setVin("");
    setVinError(null);
    setNoVinAccess(false);
    resetManualVehicleFields();
    setPhotos([]);
  }

  async function submitEstimate() {
    setSubmitError(null);
    setResult(null);

    if (!damageDescription || damageDescription.trim().length < 10) {
      setSubmitError("Please add a little more detail about the damage.");
      return;
    }

    if (!noVinAccess) {
      if (!hasValidVin) {
        setSubmitError("Please scan or enter a valid VIN (17 characters).");
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
        damageDescription: clampText(damageDescription, 2000),
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

  const heroMinHeight = "min-h-[320px] sm:min-h-[360px] lg:min-h-[420px]";

  return (
    <main className="min-h-screen bg-[#050b08] text-white">
      <div className="relative">
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

                {/* 3 Buttons: Call / Email / Get Address */}
                <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setContactModal("phone")}
                    className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-extrabold hover:bg-white/15"
                  >
                    Call
                  </button>

                  <button
                    type="button"
                    onClick={() => setContactModal("email")}
                    className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-extrabold hover:bg-white/15"
                  >
                    Email
                  </button>

                  <button
                    type="button"
                    onClick={() => setContactModal("address")}
                    className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-extrabold hover:bg-white/15"
                  >
                    Get Address
                  </button>
                </div>

                <div className="mt-3 text-xs text-white/70">
                  {BUSINESS_ADDRESS} • {BUSINESS_PHONE_PRETTY}
                </div>

                <div className="mt-4 inline-flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-xs text-white/75">
                  <div className="font-semibold text-white/90">Hours</div>
                  <div>Monday: 8:30 AM–6 PM</div>
                  <div>Tuesday: 8:30 AM–12 AM</div>
                  <div>Wednesday: 12–6 AM, 8:30 AM–6 PM</div>
                  <div>Thursday: 8:30 AM–6 PM</div>
                  <div>Friday: 8:30 AM–6 PM</div>
                  <div>Saturday: 8:30 AM–5 PM</div>
                  <div>Sunday: Closed</div>
                </div>
              </div>

              <p className="max-w-2xl text-white/85">
                Get a fast estimate range by sharing the VIN, damage details, and photos.
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
            <div className="mt-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">Vehicle Identification</h2>
                  <p className="text-sm text-white/60">
                    Scan the VIN to auto-fill vehicle details.
                  </p>
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
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-sm text-white/70 mb-2">Near your vehicle</div>
                      <button
                        type="button"
                        onClick={() => setShowVinScanner(true)}
                        className="w-full rounded-xl px-4 py-3 font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 disabled:opacity-60"
                        disabled={vinBusy || submitting}
                      >
                        {vinBusy ? "Working..." : "Open VIN Scanner"}
                      </button>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-sm text-white/70 mb-2">Have a document photo</div>
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
                      <button
                        type="button"
                        onClick={() => albumVinRef.current?.click()}
                        className="w-full rounded-xl px-4 py-3 font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 disabled:opacity-60"
                        disabled={vinBusy || submitting}
                      >
                        {vinBusy ? "Reading..." : "Open Photo Album"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="text-sm text-white/70">Enter VIN manually</label>
                      <input
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
                          } catch (e: any) {
                            setVinError(e?.message || "VIN decode failed.");
                          } finally {
                            setVinBusy(false);
                          }
                        }}
                        className="w-full rounded-2xl border border-white/10 bg-emerald-500/20 px-4 py-3 font-semibold hover:bg-emerald-500/25 disabled:opacity-60"
                        disabled={vinBusy || submitting}
                      >
                        Decode VIN
                      </button>
                    </div>
                  </div>

                  {!hasValidVin ? (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={goManualVehicle}
                        className="w-full rounded-2xl border border-red-500/30 bg-red-500/15 px-5 py-4 text-lg font-extrabold hover:bg-red-500/20 disabled:opacity-60"
                        disabled={vinBusy || submitting}
                      >
                        No access to VIN
                      </button>
                    </div>
                  ) : null}

                  {vinError ? (
                    <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                      {vinError}
                    </div>
                  ) : null}

                  {hasValidVin ? (
                    <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                      VIN:{" "}
                      <span className="font-mono font-semibold">{normalizeVin(vin)}</span>
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
                      <p className="text-sm text-white/60">
                        Select popular models or choose Other.
                      </p>
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
                          // reset model when make changes
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
                </div>
              )}
            </div>

            {/* PHOTOS */}
            <div className="mt-7">
              <h2 className="text-lg font-bold">Photos</h2>
              <p className="text-sm text-white/60">Add photos of the damaged areas.</p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                {canUseCamera ? (
                  <>
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
                    <button
                      type="button"
                      onClick={() => cameraDamageRef.current?.click()}
                      className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15 disabled:opacity-60"
                      disabled={submitting}
                    >
                      Open Camera
                    </button>
                  </>
                ) : null}

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
                  disabled={!canUploadPhotos || submitting}
                />
                <button
                  type="button"
                  onClick={() => uploadDamageRef.current?.click()}
                  className={`w-full sm:w-auto rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    canUploadPhotos
                      ? "border-white/10 bg-white/10 hover:bg-white/15"
                      : "border-white/10 bg-white/5 text-white/40 cursor-not-allowed"
                  }`}
                  disabled={!canUploadPhotos || submitting}
                >
                  Upload Photos
                </button>

                {photos.length ? (
                  <button
                    type="button"
                    onClick={() => setPhotos([])}
                    className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10 disabled:opacity-60"
                    disabled={submitting}
                  >
                    Clear Photos
                  </button>
                ) : null}
              </div>

              {photos.length ? (
                <div className="mt-3 text-sm text-white/70">
                  {photos.length} photo{photos.length === 1 ? "" : "s"} selected.
                </div>
              ) : null}
            </div>

            {/* DAMAGE DETAILS */}
            <div className="mt-7">
              <h2 className="text-lg font-bold">Damage Details</h2>
              <p className="text-sm text-white/60">Describe the damage and affected areas.</p>

              <textarea
                value={damageDescription}
                onChange={(e) => setDamageDescription(e.target.value)}
                className="mt-3 w-full min-h-[120px] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-emerald-400/40"
                placeholder="Example: Front bumper cracked, hood bent, passenger headlight broken..."
                disabled={submitting}
              />
            </div>

            {/* SUBMIT */}
            <div className="mt-7">
              <button
                type="button"
                onClick={submitEstimate}
                disabled={submitting || vinBusy}
                className="w-full rounded-2xl bg-emerald-500/25 border border-emerald-500/30 px-5 py-4 text-lg font-extrabold hover:bg-emerald-500/30 disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Get Estimate"}
              </button>

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

          <footer className="mt-8 pb-10 text-center text-xs text-white/55">
            Estimates are preliminary and may change after inspection.
          </footer>
        </div>

        {/* CONTACT ACTION MODAL */}
        {contactModal ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setContactModal(null)}
            />
            <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#07110b] p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold">
                    {contactModal === "phone"
                      ? "Call"
                      : contactModal === "email"
                      ? "Email"
                      : "Address"}
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
                    <button
                      type="button"
                      onClick={() =>
                        doShare({
                          title: BUSINESS_NAME,
                          text: BUSINESS_PHONE_PRETTY,
                        }).then((ok) =>
                          !ok ? doCopy(BUSINESS_PHONE_PRETTY, "Phone") : null
                        )
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-extrabold hover:bg-white/15"
                    >
                      Share
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
                    <button
                      type="button"
                      onClick={() =>
                        doShare({
                          title: BUSINESS_NAME,
                          text: BUSINESS_EMAIL,
                        }).then((ok) =>
                          !ok ? doCopy(BUSINESS_EMAIL, "Email") : null
                        )
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-extrabold hover:bg-white/15"
                    >
                      Share
                    </button>
                  </>
                ) : null}

                {contactModal === "address" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => doCopy(BUSINESS_ADDRESS, "Address")}
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-extrabold hover:bg-white/15"
                    >
                      Copy Address
                    </button>
                    <button
                      type="button"
                      onClick={() => doCopy(googleMapsLink, "Maps link")}
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-extrabold hover:bg-white/15"
                    >
                      Copy Maps Link
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        doShare({
                          title: BUSINESS_NAME,
                          text: BUSINESS_ADDRESS,
                          url: googleMapsLink,
                        }).then((ok) =>
                          !ok ? doCopy(googleMapsLink, "Maps link") : null
                        )
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-extrabold hover:bg-white/15"
                    >
                      Share
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* TOAST */}
        {toast ? (
          <div className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-white/10 bg-black/80 px-4 py-2 text-sm text-white shadow-lg">
            {toast}
          </div>
        ) : null}

        {/* VIN HELP MODAL */}
        {showVinHelp ? (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setShowVinHelp(false)}
            />
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
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => (vinBusy ? null : setShowVinScanner(false))}
            />
            <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#07110b] p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold">VIN Scanner</h3>
                  <p className="mt-1 text-sm text-white/60">
                    Take a clear photo of the VIN.
                  </p>
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
                  className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-4 font-extrabold border border-white/10 ${
                    vinBusy
                      ? "bg-white/5 text-white/40 cursor-not-allowed"
                      : "bg-white/10 hover:bg-white/15"
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
