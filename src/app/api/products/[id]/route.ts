import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
            walletAddress: true,
            createdAt: true,
          },
        },
      },
    });

    if (!product) {
      // Try finding by slug instead
      const productBySlug = await prisma.product.findUnique({
        where: { slug: id },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              image: true,
              walletAddress: true,
              createdAt: true,
            },
          },
        },
      });

      if (!productBySlug) {
        return NextResponse.json({ message: "Product not found" }, { status: 404 });
      }
      
      // Increment views (fire and forget)
      prisma.product.update({
        where: { id: productBySlug.id },
        data: { views: { increment: 1 } },
      }).catch(console.error);

      return NextResponse.json({ product: productBySlug }, { status: 200 });
    }

    // Increment views (fire and forget)
    prisma.product.update({
      where: { id: product.id },
      data: { views: { increment: 1 } },
    }).catch(console.error);

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Fetch product error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    if (product.sellerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    
    // Check if we are just updating status (like marking as sold after blockchain tx)
    if (body.status && Object.keys(body).length === 1) {
      const updatedStatusProduct = await prisma.product.update({
        where: { id },
        data: { status: body.status },
      });
      return NextResponse.json({ product: updatedStatusProduct }, { status: 200 });
    }

    // Otherwise validate full update
    const validatedData = productSchema.parse(body);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update product error:", error);
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    if (product.sellerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
