import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const token = req.headers.get("token") || "";

  const res = await fetch(
    "https://route-posts.routemisr.com/notifications/read-all",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({}),
    },
  );

  const data = await res.json();
  return NextResponse.json(data);
}
