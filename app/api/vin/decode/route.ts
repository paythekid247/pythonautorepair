export const runtime = "nodejs";

function normalizeVin(raw: string) {
  return (raw || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .replace(/[IOQ]/g, "");
}

function pickValue(results: any[], name: string) {
  const row = results?.find((r) => String(r.Variable).toLowerCase() === name.toLowerCase());
  const v = row?.Value;
  if (!v || v === "Not Applicable") return "";
  return String(v).trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const vin = normalizeVin(body?.vin || "");

    if (vin.length !== 17) {
      return Response.json({ ok: false, error: "VIN must be 17 characters." }, { status: 400 });
    }

    // NHTSA VPIC decode
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`;
    const r = await fetch(url, { cache: "no-store" });

    if (!r.ok) {
      return Response.json({ ok: false, error: "VIN decode service failed." }, { status: 502 });
    }

    const data = await r.json();
    const results = data?.Results || [];

    const year = pickValue(results, "Model Year");
    const make = pickValue(results, "Make");
    const model = pickValue(results, "Model");

    if (!year && !make && !model) {
      return Response.json(
        { ok: false, error: "Could not decode VIN (no data returned)." },
        { status: 422 }
      );
    }

    return Response.json({
      ok: true,
      vin,
      year: year ? Number(year) : null,
      make: make || null,
      model: model || null,
      raw: { Results: results },
    });
  } catch (err: any) {
    return Response.json(
      { ok: false, error: err?.message || "Server error decoding VIN." },
      { status: 500 }
    );
  }
}
