const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendComplaintConfirmation = async ({ to, name, complaintTitle, complaintId }) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Smart Complaint Platform" <${process.env.EMAIL_FROM}>`,
      to,
      subject: `✅ Complaint Received — ${complaintTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', -apple-system, sans-serif; background: #0A0F1C; color: #e2e8f0; margin: 0; padding: 0; }
            .container { max-width: 580px; margin: 40px auto; background: rgba(255,255,255,0.05); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 40px; }
            .logo { font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #6366f1, #a855f7, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 32px; }
            h2 { font-size: 22px; font-weight: 600; color: #f8fafc; margin: 0 0 12px; }
            p { color: #94a3b8; line-height: 1.7; margin: 0 0 16px; }
            .badge { display: inline-block; background: rgba(99,102,241,0.2); color: #a5b4fc; padding: 6px 16px; border-radius: 999px; font-size: 13px; margin-bottom: 24px; border: 1px solid rgba(99,102,241,0.3); }
            .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin: 24px 0; }
            .card-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 4px; }
            .card-value { font-size: 16px; color: #e2e8f0; font-weight: 500; }
            .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 13px; color: #475569; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">⬡ SmartService</div>
            <span class="badge">Complaint Received</span>
            <h2>Hi ${name}, we've got your complaint.</h2>
            <p>Your complaint has been successfully submitted and is now in our queue. Our team will review it shortly and you'll be notified of any status updates.</p>
            <div class="card">
              <div class="card-label">Complaint ID</div>
              <div class="card-value">#${complaintId}</div>
            </div>
            <div class="card">
              <div class="card-label">Title</div>
              <div class="card-value">${complaintTitle}</div>
            </div>
            <div class="card">
              <div class="card-label">Status</div>
              <div class="card-value">🟡 Pending Review</div>
            </div>
            <p>Track the progress of your complaint from your <a href="${process.env.CLIENT_URL}/dashboard" style="color:#818cf8;">dashboard</a>.</p>
            <div class="footer">
              Smart Complaint Service Platform · <a href="${process.env.CLIENT_URL}" style="color:#4f46e5;">smartservice.io</a><br/>
              This is an automated message. Please do not reply.
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log(`📧 Confirmation email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    // Non-blocking — don't throw, just log
  }
};

const sendStatusUpdateEmail = async ({ to, name, complaintTitle, newStatus }) => {
  const statusMessages = {
    'in-review': 'Your complaint is now being reviewed by our team.',
    'in-progress': 'We are actively working on resolving your complaint.',
    resolved: '🎉 Your complaint has been resolved!',
    closed: 'Your complaint has been closed.',
  };

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Smart Complaint Platform" <${process.env.EMAIL_FROM}>`,
      to,
      subject: `🔔 Status Update — ${complaintTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: -apple-system, sans-serif; background: #0A0F1C; color: #e2e8f0; padding: 40px;">
          <div style="max-width: 580px; margin: auto; background: rgba(255,255,255,0.05); border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">
            <h2 style="color: #f8fafc;">Status Update</h2>
            <p style="color: #94a3b8;">Hi ${name},</p>
            <p style="color: #94a3b8;">${statusMessages[newStatus] || 'Your complaint status has been updated.'}</p>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin: 24px 0;">
              <div style="font-size: 11px; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">New Status</div>
              <div style="font-size: 16px; color: #a5b4fc; font-weight: 600; text-transform: capitalize;">${newStatus.replace('-', ' ')}</div>
            </div>
            <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #a855f7); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Dashboard →</a>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('❌ Status email failed:', error.message);
  }
};

module.exports = { sendComplaintConfirmation, sendStatusUpdateEmail };
