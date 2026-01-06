export const runtime = "nodejs";

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey) {
      return Response.json({ ok: false, error: "Missing GOOGLE_MAPS_API_KEY." }, { status: 500 });
    }
    if (!placeId) {
      return Response.json({ ok: false, error: "Missing GOOGLE_PLACE_ID." }, { status: 500 });
    }

    const url = `https://places.googleapis.com/v1/places/${placeId}`;

    const r = await fetch(url, {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "displayName,rating,userRatingCount,reviews,formattedAddress,nationalPhoneNumber,websiteUri",
      },
      cache: "no-store",
    });

    const raw = await r.text();

    // Return Google's raw error to you (huge time-saver)
    if (!r.ok) {
      return Response.json(
        {
          ok: false,
          upstreamStatus: r.status,
          upstreamStatusText: r.statusText,
          googleRaw: raw.slice(0, 2000),
          hint:
            "Common causes: key restricted to HTTP referrers, Places API not enabled, billing not enabled, wrong API restriction.",
        },
        { status: 200 } // keep it 200 so curl shows JSON cleanly
      );
    }

    const data = JSON.parse(raw);

    const reviews = Array.isArray(data?.reviews)
      ? data.reviews.slice(0, 8).map((rv: any) => ({
          name: rv?.authorAttribution?.displayName || "Customer",
          rating: rv?.rating ?? null,
          text: rv?.text?.text || "",
          time: rv?.relativePublishTimeDescription || "",
        }))
      : [];

    return Response.json({
      ok: true,
      place: {
        name: data?.displayName?.text || "Python Auto Repair",
        rating: data?.rating ?? null,
        userRatingCount: data?.userRatingCount ?? null,
        formattedAddress: data?.formattedAddress || null,
        phone: data?.nationalPhoneNumber || null,
        website: data?.websiteUri || null,
      },
      reviews,
    });
  } catch (err: any) {
    return Response.json(
      { ok: false, error: err?.message || "Server error fetching place details." },
      { status: 500 }
    );
  }
}
