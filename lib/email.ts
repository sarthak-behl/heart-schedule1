import { Resend } from "resend"

// Lazy-load Resend client to avoid build-time initialization
let resendClient: Resend | null = null

function getResendClient() {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

interface SendScheduledEmailParams {
  to: string
  toName?: string
  subject: string
  body: string
  replyTo: string
  replyToName?: string
}

export async function sendScheduledEmail(params: SendScheduledEmailParams) {
  const { to, toName, subject, body, replyTo, replyToName } = params

  const recipientName = toName ? toName : to.split("@")[0]
  const senderName = replyToName || replyTo.split("@")[0]

  // Create HTML email with the message body and footer
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="color: #333333; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${body}</div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; border-top: 1px solid #e5e5e5; background-color: #fafafa; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom: 15px;">
                    <div style="color: #666666; font-size: 14px; line-height: 1.5;">
                      <strong style="color: #333333;">💌 This message was scheduled with HeartSchedule</strong><br>
                      Reply to this email to respond directly to ${senderName}.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 15px; border-top: 1px solid #e5e5e5;">
                    <div style="color: #999999; font-size: 12px;">
                      HeartSchedule helps you never miss a heartfelt moment.<br>
                      This message was thoughtfully scheduled to arrive at the perfect time.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  // Plain text version (fallback)
  const textContent = `
${body}

---

💌 This message was scheduled with HeartSchedule
Reply to this email to respond directly to ${senderName}.

HeartSchedule helps you never miss a heartfelt moment.
This message was thoughtfully scheduled to arrive at the perfect time.
  `.trim()

  try {
    const resend = getResendClient()
    const data = await resend.emails.send({
      from: `${process.env.FROM_NAME || "HeartSchedule"} <${process.env.FROM_EMAIL || "hello@heartschedule.app"}>`,
      to: toName ? `${toName} <${to}>` : to,
      subject: subject,
      html: htmlContent,
      text: textContent,
      replyTo: replyToName ? `${replyToName} <${replyTo}>` : replyTo,
    })

    return { success: true, data }
  } catch (error) {
    console.error("Error sending email via Resend:", error)
    throw error
  }
}
