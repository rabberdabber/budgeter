import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  addBudgetLimit,
  updateBudgetLimit,
  deleteBudgetLimit,
} from "@/lib/firestore-server";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { category, limit, comments, userId } = body;

    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = await addBudgetLimit({
      category,
      limit,
      comments,
      userId,
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("Error adding budget limit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await updateBudgetLimit(id, updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating budget limit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await deleteBudgetLimit(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting budget limit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
