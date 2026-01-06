export const runtime = "nodejs";

import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ ok: false, error: "Missing OPENAI_API_KEY." }, { status: 500 });
    }

    const { message, history } = await req.json();
    if (!message || typeof message !== "string") {
      return Response.json({ ok: false, error: "Missing message." }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const input = [
      {
        role: "system",
        content:
          "You are the helpful assistant for Python Auto Repair. Be concise. Ask for VIN/photos when relevant.",
      },
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: message },
    ];

    const resp = await client.responses.create({
      model: "gpt-4.1-mini",
      input,
    });

    return Response.json({ ok: true, reply: resp.output_text || "" });
  } catch (err: any) {
    return Response.json(
      { ok: false, error: err?.message || "Server error in chat." },
      { status: 500 }
    );
  }
}
