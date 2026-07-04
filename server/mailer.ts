import nodemailer from "nodemailer";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

let transporter: nodemailer.Transporter | null = null;

/**
 * Send email via Brevo REST API (preferred for cloud environments)
 */
async function sendViaBrevoAPI({ to, subject, html }: EmailPayload) {
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.SMTP_FROM || '"Malwa Sports Academy" <no-reply@malwasports.com>';

  if (!apiKey) {
    return null; // API key not available, try SMTP fallback
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: from.includes("<") ? from.split("<")[1].replace(">", "") : from, name: from.includes('"') ? from.split('"')[1] : "Malwa Sports Academy" },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Brevo API error: ${error.message || response.statusText}`);
    }

    const data: any = await response.json();
    console.log(`📨 Email successfully dispatched via Brevo API. Message ID: ${data.messageId}`);
    return { success: true, messageId: data.messageId, provider: "brevo-api" };
  } catch (error: any) {
    console.error("⚠️ Brevo API failed, falling back to SMTP:", error.message);
    return null;
  }
}

/**
 * Send email via nodemailer SMTP (fallback for local development)
 */
function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const host = process.env.SMTP_HOST?.trim();
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;

  if (!host || !user || !pass) {
    console.warn("⚠️ SMTP environment variables not defined. Email Simulation Mode enabled.");
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      requireTLS: true,
    });
    return transporter;
  } catch (error: any) {
    console.error("❌ Failed to initialize SMTP transporter:", error.message);
    return null;
  }
}

/**
 * Main email send function - tries API first, falls back to SMTP
 */
export async function sendEmail({ to, subject, html }: EmailPayload) {
  const from = process.env.SMTP_FROM || '"Malwa Sports Academy" <no-reply@malwasports.com>';

  // Try Brevo API first (cloud-friendly)
  const apiResult = await sendViaBrevoAPI({ to, subject, html });
  if (apiResult) return apiResult;

  // Fall back to SMTP
  const client = getTransporter();
  if (!client) {
    console.log(`\n--- 📬 [Email Simulation Mode] ---`);
    console.log(`From: ${from}`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body Snippet:\n${html.replace(/<[^>]*>/g, "").substring(0, 400)}...\n----------------------------------\n`);
    return { simulated: true };
  }

  try {
    const info = await client.sendMail({
      from,
      to,
      subject,
      html,
    });
    console.log(`📨 Email successfully dispatched via SMTP. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId, provider: "smtp" };
  } catch (error: any) {
    console.error("❌ Failed to send SMTP email:", error.message);
    return { success: false, error: error.message };
  }
}

// ----------------- EMAIL TEMPLATE BUILDERS -----------------

// 1. Welcome New Register
export async function sendWelcomeEmail(user: any) {
  const welcomeHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div style="background-color: #dc2626; padding: 25px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">MALWA SPORTS ACADEMY</h1>
        <p style="color: #fee2e2; margin: 5px 0 0 0; font-size: 11px; font-weight: bold; letter-spacing: 1.5px;">WELCOME TO THE ELITE PATHWAY</p>
      </div>
      <div style="padding: 30px; background-color: #ffffff; color: #18181b;">
        <h2 style="font-size: 18px; font-weight: bold; color: #18181b; margin-top: 0; text-transform: uppercase;">Registration Confirmed</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">Hello <strong>${user.name}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">Your digital portal account has been successfully created. Welcome to Central India's premier athletic training ground.</p>
        
        <div style="background-color: #f9fafb; border: 1px solid #e4e4e7; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <table style="width: 100%; font-size: 13px;">
            <tr><td style="color: #6b7280; font-weight: bold; width: 35%;">Portal Role:</td><td style="color: #dc2626; font-weight: 800; text-transform: uppercase;">${user.role}</td></tr>
            <tr><td style="color: #6b7280; font-weight: bold;">Registered Email:</td><td style="color: #1f2937; font-weight: bold;">${user.email}</td></tr>
            <tr><td style="color: #6b7280; font-weight: bold;">Contact Number:</td><td style="color: #1f2937; font-weight: bold;">${user.phone || "Not specified"}</td></tr>
          </table>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">You can now log in to access training schedules, nutrition trackers, performance logs, and submit registrations with premium privileges.</p>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 25px;">If you did not execute this registration request, please ignore or contact academy administrators.</p>
      </div>
      <div style="background-color: #1f2937; padding: 15px; text-align: center; font-size: 11px; color: #9ca3af;">
        <p style="margin: 0;">Malwa Sports Academy Arena, Sanwer Road, Indore, MP, India</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: `Account Verified - Welcome to Malwa Sports Academy`,
    html: welcomeHtml,
  });
}

export async function sendRegistrationAdminAlertEmail(user: any) {
  const adminEmail = process.env.ADMIN_EMAIL || "admissions@malwasports.com";
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px;">
      <h2 style="margin-top: 0; color: #dc2626; text-transform: uppercase;">New Portal Registration</h2>
      <p style="font-size: 14px; color: #4b5563;">A new user account has been registered in the MSA portal.</p>
      <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280; width: 35%;">Name:</td><td style="padding: 6px 0; font-weight: bold; color: #111827;">${user.name}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Email:</td><td style="padding: 6px 0; font-weight: bold; color: #111827;">${user.email}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Role:</td><td style="padding: 6px 0; font-weight: bold; color: #dc2626; text-transform: uppercase;">${user.role}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Phone:</td><td style="padding: 6px 0; font-weight: bold; color: #111827;">${user.phone || "Not provided"}</td></tr>
      </table>
    </div>
  `;

  await sendEmail({
    to: adminEmail,
    subject: `New Portal Registration: ${user.name}`,
    html: adminHtml,
  });
}

// 2. Forgot Password Reset Token
export async function sendPasswordResetEmail(email: string, resetLink: string) {
  const resetHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden;">
      <div style="background-color: #dc2626; padding: 25px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 900; text-transform: uppercase;">MALWA SPORTS ACADEMY</h1>
        <p style="color: #fee2e2; margin: 5px 0 0 0; font-size: 11px; font-weight: bold; letter-spacing: 1.5px;">PASSWORD RECOVERY CENTER</p>
      </div>
      <div style="padding: 30px; background-color: #ffffff; color: #18181b;">
        <h2 style="font-size: 18px; font-weight: bold; color: #18181b; margin-top: 0; text-transform: uppercase;">Reset Your Password</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">We received a request to recover your portal security key. Please click the red button below to configure your new passcode:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-size: 13px; font-weight: bold; text-transform: uppercase; display: inline-block; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.25);">Configure New Passcode</a>
        </div>

        <p style="font-size: 13px; line-height: 1.5; color: #6b7280;">If the button above does not work, copy and paste this complete recovery address into your web browser:</p>
        <p style="font-size: 12px; font-family: monospace; color: #dc2626; word-break: break-all; background-color: #f9fafb; padding: 10px; border-radius: 6px;">${resetLink}</p>
        
        <p style="font-size: 12px; color: #9ca3af; margin-top: 25px;">Note: This recovery path is valid for exactly 1 hour. If you did not command this action, your password remains secure.</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: `Password Reset Request - Malwa Sports Academy`,
    html: resetHtml,
  });
}

// 3. Admission Trial confirmation
export async function sendAdmissionConfirmationEmail(admissionData: any) {
  const adminEmail = process.env.ADMIN_EMAIL || "admissions@malwasports.com";
  
  const athleteHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="background-color: #dc2626; padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">MALWA SPORTS ACADEMY</h1>
        <p style="color: #fee2e2; margin: 5px 0 0 0; font-size: 12px; font-weight: bold; letter-spacing: 2px;">TRIAL EVALUATION PASS</p>
      </div>
      <div style="padding: 30px; background-color: #ffffff; color: #18181b;">
        <h2 style="font-size: 20px; font-weight: 800; text-transform: uppercase; margin-top: 0; color: #18181b; border-bottom: 2px solid #f4f4f5; padding-bottom: 10px;">Trial Admission Pass Created</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">Hello <strong>${admissionData.parentName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">Your application for <strong>${admissionData.athleteName}</strong> has been logged for high-performance evaluation trials at our elite academy.</p>
        
        <div style="background-color: #f9fafb; border: 1px dashed #d1d5db; border-radius: 12px; padding: 20px; margin: 25px 0;">
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #6b7280; font-weight: bold; width: 40%;">TICKET ID:</td><td style="padding: 6px 0; color: #dc2626; font-weight: 900; font-family: monospace; font-size: 14px;">${admissionData.ticketId}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280; font-weight: bold;">ATHLETE:</td><td style="padding: 6px 0; color: #1f2937; font-weight: bold; text-transform: uppercase;">${admissionData.athleteName} (${admissionData.age} Yrs)</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280; font-weight: bold;">SELECTED SPORT:</td><td style="padding: 6px 0; color: #dc2626; font-weight: bold; text-transform: uppercase;">${admissionData.selectedSport}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280; font-weight: bold;">EVALUATION DATE:</td><td style="padding: 6px 0; color: #1f2937; font-weight: bold;">${admissionData.trialDate} at ${admissionData.time}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280; font-weight: bold;">SKILL LEVEL:</td><td style="padding: 6px 0; color: #1f2937; font-weight: bold;">${admissionData.skillLevel} Entry</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280; font-weight: bold;">STATUS:</td><td style="padding: 6px 0; color: #d97706; font-weight: bold; text-transform: uppercase;">${admissionData.status}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280; font-weight: bold; vertical-align: top;">VENUE:</td><td style="padding: 6px 0; color: #1f2937; font-weight: bold; line-height: 1.4;">${admissionData.location}</td></tr>
          </table>
        </div>

        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 4px; margin-bottom: 25px;">
          <h4 style="margin: 0 0 5px 0; font-size: 12px; color: #b45309; font-weight: 800;">IMPORTANT INSTRUCTION</h4>
          <p style="margin: 0; font-size: 11px; line-height: 1.4; color: #78350f; font-weight: bold;">Please report 30 minutes early at our Sanwer Road entrance. Bring dynamic active sportswear and running/playing boots.</p>
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    to: admissionData.emailAddress,
    subject: `Trial evaluation booked - Ticket: ${admissionData.ticketId} [Malwa Sports Academy]`,
    html: athleteHtml,
  });

  const adminHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 25px;">
      <h2 style="color: #dc2626; font-size: 18px; margin-top: 0; text-transform: uppercase;">New Athlete Trial Admission Registered</h2>
      <p style="font-size: 14px; color: #4b5563;">An admission application has been recorded. Check details below:</p>
      <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-top: 15px;">
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Ticket ID:</td><td style="padding: 6px 0; font-weight: bold;">${admissionData.ticketId}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Athlete Name:</td><td style="padding: 6px 0; font-weight: bold;">${admissionData.athleteName} (${admissionData.age} Yrs)</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Parent/Guardian:</td><td style="padding: 6px 0; font-weight: bold;">${admissionData.parentName}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Contact:</td><td style="padding: 6px 0; font-weight: bold;">${admissionData.contactNumber}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Email:</td><td style="padding: 6px 0; font-weight: bold;">${admissionData.emailAddress}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Sport Selected:</td><td style="padding: 6px 0; font-weight: bold; color: #dc2626; text-transform: uppercase;">${admissionData.selectedSport}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Status:</td><td style="padding: 6px 0; font-weight: bold; color: #b45309;">${admissionData.status}</td></tr>
      </table>
    </div>
  `;

  await sendEmail({
    to: adminEmail,
    subject: `🚨 NEW Trial request: ${admissionData.athleteName} [${admissionData.selectedSport.toUpperCase()}]`,
    html: adminHtml,
  });
}

// 4. General Inquiry Alert (sends to inquirer user AND admin)
export async function sendContactInquiryEmail(contactData: any) {
  const adminEmail = process.env.ADMIN_EMAIL || "admissions@malwasports.com";

  // Email to Admin
  const adminHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 25px; color: #18181b;">
      <h2 style="color: #dc2626; font-size: 18px; margin-top: 0; text-transform: uppercase;">General Inquiry Dispatched</h2>
      <p style="font-size: 14px; color: #4b5563;">A direct inquiry was received through the portal contact form:</p>
      
      <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-top: 15px;">
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280; width: 30%;">Inquirer Name:</td><td style="padding: 6px 0; font-weight: bold; color: #18181b;">${contactData.name}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Phone Number:</td><td style="padding: 6px 0; font-weight: bold; color: #18181b;">${contactData.phone}</td></tr>
        ${contactData.email ? `<tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Inquirer Email:</td><td style="padding: 6px 0; font-weight: bold; color: #18181b;">${contactData.email}</td></tr>` : ""}
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280; vertical-align: top;">Query Detail:</td><td style="padding: 6px 0; color: #18181b; line-height: 1.5;">${contactData.query}</td></tr>
      </table>
    </div>
  `;

  await sendEmail({
    to: adminEmail,
    subject: `📞 General Enquiry from ${contactData.name}`,
    html: adminHtml,
  });

  // If the inquirer provided an email, send them a receipt
  if (contactData.email) {
    const userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #dc2626; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 900; text-transform: uppercase;">MALWA SPORTS ACADEMY</h1>
        </div>
        <div style="padding: 25px; background-color: #ffffff; color: #18181b;">
          <h3 style="font-size: 16px; color: #18181b; margin-top: 0; text-transform: uppercase;">Inquiry Dispatched Successfully</h3>
          <p style="font-size: 14px; line-height: 1.5; color: #4b5563;">Hello <strong>${contactData.name}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.5; color: #4b5563;">Thank you for writing to us. We have successfully registered your inquiry in our academy systems. Here are the logged details:</p>
          
          <div style="background-color: #f9fafb; border: 1px solid #e4e4e7; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 13px;">
            <p style="margin: 0 0 8px 0;"><strong>Logged Name:</strong> ${contactData.name}</p>
            <p style="margin: 0 0 8px 0;"><strong>Message/Inquiry:</strong> "${contactData.query}"</p>
          </div>
          
          <p style="font-size: 14px; line-height: 1.5; color: #4b5563;">Our admissions counselor will follow up with you on WhatsApp or phone within 4 business hours.</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: contactData.email,
      subject: `Inquiry Receipt - Malwa Sports Academy`,
      html: userHtml,
    });
  }
}

// 5. Event reservation confirmation (sends to inquirer user AND admin)
export async function sendEventRegistrationNotificationEmail(eventData: any) {
  const adminEmail = process.env.ADMIN_EMAIL || "admissions@malwasports.com";

  // Admin Notification
  const adminHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 25px;">
      <h2 style="color: #dc2626; font-size: 18px; margin-top: 0; text-transform: uppercase;">Event Seat Reserved</h2>
      <p style="font-size: 14px; color: #4b5563;">An athlete has booked an event seat slot. Details below:</p>
      
      <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-top: 15px;">
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280; width: 30%;">Athlete Name:</td><td style="padding: 6px 0; font-weight: bold;">${eventData.athleteName}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Event Title:</td><td style="padding: 6px 0; font-weight: bold; color: #dc2626; text-transform: uppercase;">${eventData.eventTitle}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Mobile Number:</td><td style="padding: 6px 0; font-weight: bold;">${eventData.mobileNumber}</td></tr>
        ${eventData.email ? `<tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Email Address:</td><td style="padding: 6px 0; font-weight: bold;">${eventData.email}</td></tr>` : ""}
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Tracking Token:</td><td style="padding: 6px 0; font-weight: bold; font-family: monospace; color: #dc2626;">${eventData.token}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold; color: #6b7280;">Status:</td><td style="padding: 6px 0; font-weight: bold; color: #b45309;">${eventData.status || "Pending"}</td></tr>
      </table>
    </div>
  `;

  await sendEmail({
    to: adminEmail,
    subject: `🏆 Event Booking Request: ${eventData.athleteName} for ${eventData.eventTitle}`,
    html: adminHtml,
  });

  // If email is available for event inquirer, send confirmation receipt
  if (eventData.email) {
    const userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background-color: #dc2626; padding: 25px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 900; uppercase;">MALWA SPORTS ACADEMY</h1>
          <p style="color: #fee2e2; margin: 5px 0 0 0; font-size: 11px; font-weight: bold; letter-spacing: 1px;">EVENT BOOKING TRANSCRIPT</p>
        </div>
        <div style="padding: 30px; background-color: #ffffff; color: #18181b;">
          <h2 style="font-size: 18px; font-weight: 800; text-transform: uppercase; margin-top: 0;">Registration Logged</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">Hello <strong>${eventData.athleteName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">Your seat reservation is currently under review by our athletic board for the following event:</p>
          
          <div style="background-color: #f9fafb; border: 1px solid #e4e4e7; border-radius: 10px; padding: 18px; margin: 20px 0;">
            <table style="width: 100%; font-size: 13px;">
              <tr><td style="color: #6b7280; font-weight: bold; width: 35%;">EVENT TITLE:</td><td style="color: #1f2937; font-weight: bold; text-transform: uppercase;">${eventData.eventTitle}</td></tr>
              <tr><td style="color: #6b7280; font-weight: bold;">TRACKING CODE:</td><td style="color: #dc2626; font-weight: 900; font-family: monospace; font-size: 14px;">${eventData.token}</td></tr>
              <tr><td style="color: #6b7280; font-weight: bold;">MOBILE REGISTERED:</td><td style="color: #1f2937; font-weight: bold;">${eventData.mobileNumber}</td></tr>
              <tr><td style="color: #6b7280; font-weight: bold;">STATUS:</td><td style="color: #d97706; font-weight: bold; text-transform: uppercase;">${eventData.status || "Pending"}</td></tr>
            </table>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">Your registration status has also been reflected directly onto your portal dashboard. We will notify you over email and WhatsApp when the seat clearance is complete.</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: eventData.email,
      subject: `Event Ticket Logged: ${eventData.token} - [Malwa Sports Academy]`,
      html: userHtml,
    });
  }
}

export async function sendAdmissionStatusUpdateEmail(admissionData: any) {
  const adminEmail = process.env.ADMIN_EMAIL || "admissions@malwasports.com";

  const userHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px;">
      <h2 style="margin-top: 0; color: #dc2626; text-transform: uppercase;">Trial Status Updated</h2>
      <p>Hello <strong>${admissionData.parentName}</strong>,</p>
      <p>Your athlete trial status has changed for <strong>${admissionData.athleteName}</strong>.</p>
      <p><strong>Ticket:</strong> ${admissionData.ticketId}</p>
      <p><strong>Status:</strong> <span style="color: #dc2626; font-weight: bold; text-transform: uppercase;">${admissionData.status}</span></p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px;">
      <h2 style="margin-top: 0; color: #dc2626; text-transform: uppercase;">Trial Status Action Logged</h2>
      <p>An admission status has been updated in the dashboard.</p>
      <p><strong>Athlete:</strong> ${admissionData.athleteName}</p>
      <p><strong>Ticket:</strong> ${admissionData.ticketId}</p>
      <p><strong>Status:</strong> ${admissionData.status}</p>
    </div>
  `;

  await sendEmail({
    to: admissionData.emailAddress,
    subject: `Trial Status Updated: ${admissionData.status}`,
    html: userHtml,
  });

  await sendEmail({
    to: adminEmail,
    subject: `Admission Updated: ${admissionData.ticketId} (${admissionData.status})`,
    html: adminHtml,
  });
}

export async function sendEventStatusUpdateEmail(eventData: any) {
  const adminEmail = process.env.ADMIN_EMAIL || "admissions@malwasports.com";

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px;">
      <h2 style="margin-top: 0; color: #dc2626; text-transform: uppercase;">Event Booking Status Updated</h2>
      <p><strong>Athlete:</strong> ${eventData.athleteName}</p>
      <p><strong>Event:</strong> ${eventData.eventTitle}</p>
      <p><strong>Token:</strong> ${eventData.token}</p>
      <p><strong>Status:</strong> ${eventData.status}</p>
    </div>
  `;

  await sendEmail({
    to: adminEmail,
    subject: `Event Status Updated: ${eventData.token} (${eventData.status})`,
    html: adminHtml,
  });

  if (!eventData.email) return;

  const userHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px;">
      <h2 style="margin-top: 0; color: #dc2626; text-transform: uppercase;">Your Event Status Was Updated</h2>
      <p>Hello <strong>${eventData.athleteName}</strong>, your reservation was updated.</p>
      <p><strong>Event:</strong> ${eventData.eventTitle}</p>
      <p><strong>Token:</strong> ${eventData.token}</p>
      <p><strong>Status:</strong> <span style="color: #dc2626; font-weight: bold; text-transform: uppercase;">${eventData.status}</span></p>
    </div>
  `;

  await sendEmail({
    to: eventData.email,
    subject: `Event Reservation Status: ${eventData.status}`,
    html: userHtml,
  });
}

export async function sendEventCancellationEmail(eventData: any) {
  const adminEmail = process.env.ADMIN_EMAIL || "admissions@malwasports.com";

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px;">
      <h2 style="margin-top: 0; color: #dc2626; text-transform: uppercase;">Event Booking Cancelled</h2>
      <p>A user cancelled their event reservation.</p>
      <p><strong>Athlete:</strong> ${eventData.athleteName}</p>
      <p><strong>Event:</strong> ${eventData.eventTitle}</p>
      <p><strong>Token:</strong> ${eventData.token}</p>
      <p><strong>Status:</strong> Cancelled</p>
    </div>
  `;

  await sendEmail({
    to: adminEmail,
    subject: `Event Cancelled: ${eventData.token}`,
    html: adminHtml,
  });

  if (!eventData.email) return;

  const userHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px;">
      <h2 style="margin-top: 0; color: #dc2626; text-transform: uppercase;">Event Booking Cancelled</h2>
      <p>Hello <strong>${eventData.athleteName}</strong>, your event booking has been cancelled successfully.</p>
      <p><strong>Event:</strong> ${eventData.eventTitle}</p>
      <p><strong>Token:</strong> ${eventData.token}</p>
    </div>
  `;

  await sendEmail({
    to: eventData.email,
    subject: `Event Booking Cancelled: ${eventData.token}`,
    html: userHtml,
  });
}

export async function sendEventDeletedEmail(eventData: any) {
  const adminEmail = process.env.ADMIN_EMAIL || "admissions@malwasports.com";

  await sendEmail({
    to: adminEmail,
    subject: `Event Booking Deleted: ${eventData.token}`,
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px;"><h2 style="margin-top: 0; color: #dc2626; text-transform: uppercase;">Event Booking Deleted</h2><p>A booking has been permanently removed from records.</p><p><strong>Athlete:</strong> ${eventData.athleteName}</p><p><strong>Event:</strong> ${eventData.eventTitle}</p><p><strong>Token:</strong> ${eventData.token}</p></div>`,
  });

  if (!eventData.email) return;

  await sendEmail({
    to: eventData.email,
    subject: `Event Booking Removed: ${eventData.token}`,
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px;"><h2 style="margin-top: 0; color: #dc2626; text-transform: uppercase;">Event Booking Deleted</h2><p>Hello <strong>${eventData.athleteName}</strong>, your event reservation has been removed from the system by administration.</p><p><strong>Event:</strong> ${eventData.eventTitle}</p><p><strong>Token:</strong> ${eventData.token}</p></div>`,
  });
}
