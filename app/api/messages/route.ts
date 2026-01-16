import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const messageSchema = z.object({
  occasion: z.string().min(1),
  recipientEmail: z.string().email(),
  recipientName: z.string().optional(),
  subject: z.string().min(1),
  body: z.string().min(1),
  scheduledAt: z.string().datetime(),
  isAiGenerated: z.boolean().optional(),
})

// GET /api/messages - Get all messages for the current user
export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const messages = await prisma.message.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        scheduledAt: "asc",
      },
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

// POST /api/messages - Create a new scheduled message
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = messageSchema.parse(body)

    // Create message
    const message = await prisma.message.create({
      data: {
        userId: session.user.id,
        occasion: validatedData.occasion,
        recipientEmail: validatedData.recipientEmail,
        recipientName: validatedData.recipientName || null,
        subject: validatedData.subject,
        body: validatedData.body,
        scheduledAt: new Date(validatedData.scheduledAt),
        isAiGenerated: validatedData.isAiGenerated || false,
        status: "pending",
      },
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error("Error creating message:", error)
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    )
  }
}
