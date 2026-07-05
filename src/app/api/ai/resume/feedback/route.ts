import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "lib/auth-options";
import { db } from "lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const body = await req.json();
    const { suggestionId, feedback, state } = body;

    if (!suggestionId) {
      return NextResponse.json({ error: "suggestionId is required" }, { status: 400 });
    }

    const log = await db.aISuggestionLog.findFirst({
      where: { id: suggestionId, userId },
    });

    if (!log) {
      return NextResponse.json({ error: "Suggestion log not found" }, { status: 404 });
    }

    const updated = await db.aISuggestionLog.update({
      where: { id: suggestionId },
      data: {
        ...(feedback ? { feedback } : {}),
        ...(state ? { state } : {}),
      },
    });

    return NextResponse.json({ success: true, log: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
