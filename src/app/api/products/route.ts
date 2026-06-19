import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { Category } from "@prisma/client";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString(36);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") as Category | null;
    const status = searchParams.get("status") || "APPROVED";
    const sellerId = searchParams.get("sellerId");
    
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category) where.category = category;
    if (status !== "ALL") where.status = status;
    if (sellerId) where.sellerId = sellerId;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              image: true,
              walletAddress: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json(
      {
        products,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch products error:", error);
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

    const body = await req.json();
    const validatedData = productSchema.parse(body);

    const slug = generateSlug(validatedData.title);

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        slug,
        sellerId: session.user.id,
        status: "APPROVED", // In a real app, might be PENDING for admin review
      },
    });

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create product error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
