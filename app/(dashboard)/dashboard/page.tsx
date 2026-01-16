import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch user's messages
  const messages = await prisma.message.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      scheduledAt: "asc",
    },
  })

  const pendingMessages = messages.filter((m: { status: string }) => m.status === "pending")
  const sentMessages = messages.filter((m: { status: string }) => m.status === "sent")

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session.user.name || "there"}!
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your scheduled heartfelt messages
            </p>
          </div>
          <Link href="/messages/new">
            <Button size="lg" className="gap-2">
              <span className="text-xl">+</span> New Message
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Messages</CardDescription>
              <CardTitle className="text-4xl">{messages.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Scheduled</CardDescription>
              <CardTitle className="text-4xl text-purple-600">
                {pendingMessages.length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Sent</CardDescription>
              <CardTitle className="text-4xl text-green-600">
                {sentMessages.length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Messages List */}
        {messages.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="text-6xl mb-4">💌</div>
              <h3 className="text-2xl font-semibold mb-2">
                No messages yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first scheduled message to never miss a special moment
              </p>
              <Link href="/messages/new">
                <Button size="lg">Schedule Your First Message</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Messages</h2>

            {messages.map((message: any) => (
              <Card key={message.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {message.occasion === "birthday" && "🎂"}
                          {message.occasion === "anniversary" && "❤️"}
                          {message.occasion === "apology" && "🙏"}
                          {message.occasion === "gratitude" && "🙌"}
                          {message.occasion === "congratulations" && "🎉"}
                          {message.occasion === "just_because" && "💌"}
                          {!["birthday", "anniversary", "apology", "gratitude", "congratulations", "just_because"].includes(message.occasion) && "✉️"}
                        </span>
                        <div>
                          <CardTitle className="text-lg">
                            {message.subject}
                          </CardTitle>
                          <CardDescription>
                            To: {message.recipientName || message.recipientEmail}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {message.status === "pending" && (
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          Scheduled
                        </span>
                      )}
                      {message.status === "sent" && (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Sent
                        </span>
                      )}
                      {message.status === "failed" && (
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          Failed
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {message.body}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {message.status === "pending" ? "Sends" : "Sent"} on{" "}
                      {format(new Date(message.scheduledAt), "PPP 'at' p")}
                    </span>
                    {message.isAiGenerated && (
                      <span className="text-purple-600 text-xs">✨ AI Generated</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
