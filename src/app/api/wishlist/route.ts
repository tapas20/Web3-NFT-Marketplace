import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { id: "desc" }, // No createdAt on wishlist model, ordering by ID
    });

    return NextResponse.json({ wishlist }, { status: 200 });
  } catch (error) {
    console.error("Fetch wishlist error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ message: "Product ID required" }, { status: 400 });
    }

    // Check if it's already in the wishlist
    const existingEntry = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existingEntry) {
      // Toggle off (remove)
      await prisma.wishlist.delete({
        where: { id: existingEntry.id },
      });
      return NextResponse.json({ message: "Removed from wishlist", status: "removed" }, { status: 200 });
    } else {
      // Toggle on (add)
      const newEntry = await prisma.wishlist.create({
        data: {
          userId: session.user.id,
          productId,
        },
      });
      return NextResponse.json({ message: "Added to wishlist", status: "added", entry: newEntry }, { status: 201 });
    }
  } catch (error) {
    console.error("Toggle wishlist error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
