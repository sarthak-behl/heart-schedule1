import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateMessage, type MessageTone, type Occasion } from "@/lib/ai"
import { z } from "zod"

const generateSchema = z.object({
  occasion: z.enum(["birthday", "anniversary", "apology", "gratitude", "congratulations", "just_because", "custom"]),
  recipientName: z.string().optional(),
  tone: z.enum(["warm", "formal", "casual", "heartfelt"]),
  context: z.string().min(10, "Please provide more context about what you want to say (at least 10 characters)"),
})

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = generateSchema.parse(body)

    // Generate message using AI
    const generatedMessage = await generateMessage({
      occasion: validatedData.occasion as Occasion,
      recipientName: validatedData.recipientName,
      tone: validatedData.tone as MessageTone,
      context: validatedData.context,
    })

    return NextResponse.json(generatedMessage)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error("Error generating message:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate message" },
      { status: 500 }
    )
  }
}
