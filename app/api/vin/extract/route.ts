import { NextResponse } from "next/server";

export const runtime = "nodejs";

function jsonError(status: number, error: string, extra?: any) {
  return NextResponse.json({ ok: false, error, ...(extra ? { extra } : {}) }, { status });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const imageBase64 = body?.imageBase64;
    const mimeType = body?.mimeType || "image/jpeg";

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return jsonError(400, "Missing imageBase64 (base64 string).");
    }
    if (typeof mimeType !== "string") {
      return jsonError(400, "Invalid mimeType.");
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return jsonError(500, "Missing OPENAI_API_KEY on server.");
    }

    // Make a valid data URL string (NOT an object)
    const dataUrl = `data:${mimeType};base64,${imageBase64}`;

    // Correct OpenAI request shape for images
    const payload = {
      model: process.env.OPENAI_VISION_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Extract the VIN from the image if present. " +
                "Return ONLY a JSON object like {\"vin\":\"...\"} or {\"vin\":null}. " +
                "VINs are exactly 17 characters A-Z and 0-9, excluding I,O,Q.",
            },
            {
              type: "input_image",
              image_url: dataUrl,
            },
          ],
        },
      ],
      // Helps keep output clean
      temperature: 0,
    };

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const raw = await r.text();
    if (!r.ok) {
      return jsonError(r.status, "OpenAI request failed.", { raw: raw.slice(0, 1200) });
    }

    const data = JSON.parse(raw);

    // responses API often returns text in output_text
    const text =
      data?.output?.[0]?.content?.find((c: any) => c?.type === "output_text")?.text ??
      data?.output_text ??
      "";

    // Parse JSON strictly
    let parsed: any = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      // fallback: try to find a VIN-looking string
      const m = String(text).match(/[A-HJ-NPR-Z0-9]{17}/);
      parsed = { vin: m ? m[0] : null };
    }

    const vin = typeof parsed?.vin === "string" ? parsed.vin : null;

    return NextResponse.json({
      ok: true,
      vin: vin ? vin.toUpperCase() : null,
    });
  } catch (e: any) {
    return jsonError(500, e?.message || "Server error.");
  }
}
