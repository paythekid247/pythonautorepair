export const runtime = "nodejs";

import OpenAI from "openai";

function normalizeVin(raw: string) {
  return (raw || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .replace(/[IOQ]/g, "");
}

function extractLikelyVin(text: string) {
  const cleaned = normalizeVin(text);
  // Find any 17-char sequences inside
  const match = cleaned.match(/[A-HJ-NPR-Z0-9]{17}/);
  return match?.[0] || "";
}

export async function POST(req: Request) {
  try {
    const { imageBase64, mimeType } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ ok: false, error: "Missing OPENAI_API_KEY." }, { status: 500 });
    }
    if (!imageBase64) {
      return Response.json({ ok: false, error: "Missing imageBase64." }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Use Responses API (recommended for new projects) :contentReference[oaicite:4]{index=4}
    const resp = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Read the VIN from this image. Return ONLY the 17-character VIN (no extra words). If you can't find it, return NONE.",
            },
            {
              type: "input_image",
              image_url: `data:${mimeType || "image/jpeg"};base64,${imageBase64}`,
            },
          ],
        },
      ],
    });

    const outText =
      resp.output_text ||
      (resp.output?.[0] as any)?.content?.map((c: any) => c?.text)?.join("") ||
      "";

    if (String(outText).trim().toUpperCase().includes("NONE")) {
      return Response.json({ ok: false, error: "Could not read VIN from image." }, { status: 422 });
    }

    const vin = extractLikelyVin(outText);

    if (vin.length !== 17) {
      return Response.json({ ok: false, error: "Could not read VIN from image." }, { status: 422 });
    }

    return Response.json({ ok: true, vin });
  } catch (err: any) {
    return Response.json(
      { ok: false, error: err?.message || "Server error extracting VIN." },
      { status: 500 }
    );
  }
}
