export const runtime = "nodejs";

import OpenAI from "openai";

type Lang = "en" | "es-CO" | "ht" | "ru";

function pickLang(req: Request, body: any): Lang {
  const h = (req.headers.get("x-lang") || "").trim() as Lang;
  const b = (body?.lang || "").trim() as Lang;

  const v = (h || b || "en") as Lang;
  return v === "en" || v === "es-CO" || v === "ht" || v === "ru" ? v : "en";
}

function clampText(s: string, max = 2000) {
  if (!s) return "";
  const t = String(s);
  return t.length > max ? t.slice(0, max) + "…" : t;
}

function asCleanStr(v: any, max = 200) {
  if (v == null) return "";
  return clampText(String(v).trim(), max);
}

function asMaybeNumber(v: any): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function i18n(lang: Lang) {
  const m = {
    en: {
      missingKey: "Missing OPENAI_API_KEY.",
      invalidBody: "Invalid JSON body.",
      missingVehicle: "Missing vehicle info. Provide VIN or Year/Make/Model.",
      ok: "Estimate generated.",
      model: "You are an auto body repair estimator.",
    },
    "es-CO": {
      missingKey: "Falta OPENAI_API_KEY.",
      invalidBody: "El cuerpo JSON no es válido.",
      missingVehicle: "Faltan datos del vehículo. Envía VIN o Año/Marca/Modelo.",
      ok: "Estimación generada.",
      model: "Eres un estimador de reparación de carrocería.",
    },
    ht: {
      missingKey: "OPENAI_API_KEY manke.",
      invalidBody: "JSON kò a pa valab.",
      missingVehicle: "Enfòmasyon machin lan manke. Voye VIN oswa Ane/Mak/Modèl.",
      ok: "Estimasyon an pare.",
      model: "Ou se yon estimatè reparasyon karosri machin.",
    },
    ru: {
      missingKey: "Отсутствует OPENAI_API_KEY.",
      invalidBody: "Некорректное тело JSON.",
      missingVehicle: "Не хватает данных об авто. Укажите VIN или Год/Марка/Модель.",
      ok: "Оценка сформирована.",
      model: "Вы — оценщик кузовного ремонта.",
    },
  }[lang];

  return m;
}

// ✅ Always returns valid JSON or throws controlled errors
async function readBodySafe(req: Request) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

// ✅ A strict JSON schema we ask the model to return
const ESTIMATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    price: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalLow: { type: "number" },
        totalHigh: { type: "number" },
        laborHoursLow: { type: "number" },
        laborHoursHigh: { type: "number" },
      },
      required: ["totalLow", "totalHigh", "laborHoursLow", "laborHoursHigh"],
    },
    likelyRepairs: { type: "array", items: { type: "string" } },
    recommendedNextSteps: { type: "array", items: { type: "string" } },
    disclaimer: { type: "string" },
  },
  required: ["summary", "confidence", "price", "likelyRepairs", "recommendedNextSteps", "disclaimer"],
} as const;

export async function POST(req: Request) {
  const body = await readBodySafe(req);

  // Basic validation (and always JSON response)
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ ok: false, error: "Missing OPENAI_API_KEY." }, { status: 500 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const lang = pickLang(req, body);
  const t = i18n(lang);

  // Fields from your frontend
  const name = asCleanStr(body.name, 80);
  const phone = asCleanStr(body.phone, 40);
  const location = asCleanStr(body.location, 80);

  const vin = asCleanStr(body.vin, 30); // may be empty
  const year = asMaybeNumber(body.year);
  const make = asCleanStr(body.make, 40);
  const model = asCleanStr(body.model, 60);

  const damageDescription = clampText(asCleanStr(body.damageDescription, 2000), 2000);

  const hasVehicle = Boolean(vin) || (Boolean(year) && Boolean(make) && Boolean(model));
  if (!hasVehicle) {
    return Response.json({ ok: false, error: t.missingVehicle }, { status: 400 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    // IMPORTANT: your UI does not actually upload photo bytes to this endpoint yet,
    // so we base the estimate on text + vehicle info for now.
    const vehicleLine = vin
      ? `VIN: ${vin}`
      : `Vehicle: ${year || ""} ${make || ""} ${model || ""}`.trim();

    const userContext = [
      name ? `Customer name: ${name}` : "",
      phone ? `Customer phone: ${phone}` : "",
      location ? `Customer location: ${location}` : "",
      vehicleLine,
      damageDescription ? `Damage description: ${damageDescription}` : "Damage description: (none provided)",
      "",
      "Task: produce a fast preliminary estimate range for auto body repair.",
      "Constraints:",
      "- Return JSON ONLY that matches the provided schema.",
      "- Use USD pricing. Give a low/high total range and labor hours range.",
      "- If info is insufficient, keep confidence low and widen range.",
      "- Recommend next steps (photos needed, inspection, parts lead times, etc.).",
      `- Output language must be: ${lang}.`,
    ]
      .filter(Boolean)
      .join("\n");

    const resp = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                `${t.model}\n` +
                "Be realistic. Do not promise exact pricing. Prefer conservative ranges.\n" +
                "Avoid brand/legal claims. Keep it practical and short.",
            },
          ],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: userContext }],
        },
      ],
      // Strict structured output:
      text: {
        format: {
          type: "json_schema",
          name: "estimate_result",
          schema: ESTIMATE_SCHEMA as any,
          strict: true,
        },
      },
    });

    // The OpenAI SDK returns parsed JSON in output_text as a string, but we’re strict:
    const out = resp.output_text || "";
    let estimate: any = null;

    try {
      estimate = JSON.parse(out);
    } catch {
      // Fallback: never return invalid JSON to the client
      return Response.json(
        {
          ok: false,
          error: "Model returned invalid JSON.",
          debug: { outSnippet: String(out).slice(0, 300) },
        },
        { status: 502 }
      );
    }

    // Final sanity clamp
    const low = Number(estimate?.price?.totalLow);
    const high = Number(estimate?.price?.totalHigh);
    if (!Number.isFinite(low) || !Number.isFinite(high) || low < 0 || high < 0 || high < low) {
      return Response.json(
        {
          ok: false,
          error: "Model returned an invalid price range.",
          debug: { price: estimate?.price },
        },
        { status: 502 }
      );
    }

    return Response.json(
      {
        ok: true,
        message: t.ok,
        lang,
        estimate,
        received: {
          name: name || null,
          phone: phone || null,
          location: location || null,
          vin: vin || null,
          year: year ?? null,
          make: make || null,
          model: model || null,
          damageDescription: damageDescription || null,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    const msg = err?.message ? String(err.message) : "Server error generating estimate.";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
