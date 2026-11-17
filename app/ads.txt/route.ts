import { NextResponse } from "next/server";
import { getAdsensePublisherId } from "@/lib/consent";

export const dynamic = "force-dynamic";

export function GET() {
  const publisherId = getAdsensePublisherId();
  if (!publisherId) {
    return new NextResponse("ads.txt not configured\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new NextResponse(
    `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}
