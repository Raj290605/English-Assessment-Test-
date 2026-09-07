import { BrevoClient } from '@getbrevo/brevo';

interface SendStudentCredentialsParams {
  name: string;
  email: string;
  loginId: string;
  temporaryPassword: string;
  loginUrl: string;
}

export async function sendStudentCredentialsEmail({
  name,
  email,
  loginId,
  temporaryPassword,
  loginUrl,
}: SendStudentCredentialsParams): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || 'Skillsoft Overseas Education';

    if (!apiKey || !senderEmail) {
      return { success: false, error: 'Email service is not configured' };
    }

    const client = new BrevoClient({ apiKey });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #334155;
            line-height: 1.6;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
          }
          .header {
            background-color: #059669;
            color: #ffffff;
            padding: 30px 40px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.025em;
          }
          .content {
            padding: 40px;
          }
          .credentials-box {
            background-color: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
          }
          .label {
            font-size: 12px;
            text-transform: uppercase;
            font-weight: 700;
            color: #64748b;
            letter-spacing: 0.05em;
          }
          .value {
            font-size: 18px;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 15px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          }
          .value:last-child {
            margin-bottom: 0;
          }
          .button-container {
            text-align: center;
            margin: 35px 0;
          }
          .button {
            display: inline-block;
            background-color: #059669;
            color: #ffffff;
            font-weight: 600;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            transition: background-color 0.2s;
          }
          .button:hover {
            background-color: #047857;
          }
          .footer {
            padding: 30px 40px;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 13px;
            color: #64748b;
          }
          .security-note {
            background-color: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 15px 20px;
            border-radius: 4px;
            font-size: 14px;
            color: #92400e;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Skillsoft Overseas Education</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your student account has been successfully created. You can now log in to your student portal using the credentials below.</p>
            
            <div class="credentials-box">
              <div class="label">Login ID</div>
              <div class="value">${loginId}</div>
              
              <div class="label">Temporary Password</div>
              <div class="value">${temporaryPassword}</div>
            </div>

            <div class="button-container">
              <a href="${loginUrl}" class="button">Log In to Student Portal</a>
            </div>

            <p style="font-size: 14px; text-align: center;">Or copy and paste this link into your browser:<br>
            <a href="${loginUrl}" style="color: #059669;">${loginUrl}</a></p>

            <div class="security-note">
              <strong>Security Notice:</strong> For your security, you will be required to change your temporary password when you log in for the first time. Please do not share your login credentials with anyone.
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Skillsoft Overseas Education. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await client.transactionalEmails.sendTransacEmail({
      subject: 'Welcome to Skillsoft Overseas Education — Your Login Credentials',
      sender: { name: senderName, email: senderEmail },
      to: [{ email: email, name: name }],
      htmlContent: htmlContent,
    });

    return { success: true };
  } catch (error: any) {
    console.error('[Email Service Error]', error.message || error);
    return { success: false, error: error.message || 'Failed to send transactional email' };
  }
}
