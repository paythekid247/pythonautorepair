import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure server runtime
export const dynamic = "force-dynamic";

function jsonError(message: string, status = 400, extra?: any) {
  return NextResponse.json(
    { ok: false, error: message, ...(extra ? { extra } : {}) },
    { status }
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("placeId");

  if (!placeId) return jsonError("Missing placeId", 400);

  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) return jsonError("Server misconfigured: GOOGLE_MAPS_SERVER_KEY missing", 500);

  // Places API (New) Place Details
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`;

  // Use FieldMask to avoid paying for / retrieving unnecessary fields
  const fieldMask = [
    "id",
    "displayName",
    "formattedAddress",
    "location",
    "nationalPhoneNumber",
    "websiteUri",
    "rating",
    "userRatingCount",
    "googleMapsUri",
    "regularOpeningHours",
    "reviews",
  ].join(",");

  let resp: Response;
  try {
    resp = await fetch(url, {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": fieldMask,
      },
      cache: "no-store",
    });
  } catch (e: any) {
    return jsonError("Network error calling Google Places", 502, { message: e?.message });
  }

  const text = await resp.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // keep raw text if Google returns non-JSON (rare, but happens)
  }

  if (!resp.ok) {
    return jsonError("Google Places error", resp.status, {
      status: resp.status,
      statusText: resp.statusText,
      googleRaw: data ?? text,
    });
  }

  return NextResponse.json({ ok: true, place: data }, { status: 200 });
}
