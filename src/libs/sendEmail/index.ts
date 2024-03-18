import nodemailer, { Transporter, SendMailOptions, SentMessageInfo } from "nodemailer";
import { google } from "googleapis";
import { Attachment } from "nodemailer/lib/mailer";
import * as ejs from 'ejs';
import * as path from "path";
import * as fs from "fs";

/**
 * Interface representing options for sending an email.
 */
interface EmailOptionsBase {
  to: string; // Recipient email address
  subject: string; // Email subject
  attachments?: Attachment[]; // Optional email attachments
  bcc?: string; // Optional blind carbon copy recipient
}

interface HtmlEmailOptions extends EmailOptionsBase {
  html: string; // HTML content of the email
  template?: never; // Template should not be present in HTML email options
  context?: never; // Context should not be present in HTML email options
}

interface TemplatedEmailOptions extends EmailOptionsBase {
  template: string; // Path to the Handlebars template file
  context: { [key: string]: string | number }; // Data to be passed into the template
  html?: never; // HTML should not be present in templated email options
}

export type EmailOptions = HtmlEmailOptions | TemplatedEmailOptions;

/**
 * Interface representing configuration for Gmail OAuth2 authentication.
 */
interface GmailAuthConfig {
  clientId: string; // Google OAuth2 client ID
  clientSecret: string; // Google OAuth2 client secret
  redirectUrl: string; // Redirect URL for OAuth2 flow
  refreshToken: string; // Refresh token for OAuth2 authentication
  userEmail: string; // User's email address
  accessToken: string; // Access token for OAuth2 authentication
}

/**
 * Sends an email using nodemailer based on provided email options.
 * @param emailOptions Options for sending the email.
 * @returns Promise<SentMessageInfo> Promise resolving to the sent message information.
 */
async function sendEmail(emailOptions: EmailOptions): Promise<SentMessageInfo> {
  try {
    const transporterSettings = await getTransporterSettings();
    const transporter: Transporter = nodemailer.createTransport(transporterSettings);
    const mailOptions: SendMailOptions = buildMailOptions(emailOptions);
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * Retrieves transporter settings based on SMTP type.
 * @returns Promise<any> Promise resolving to transporter settings.
 */
async function getTransporterSettings(): Promise<any> {
  const smtpType = process.env.SMTP_TYPE;
  if (smtpType === "gmail") {
    const gmailAuthConfig = await getGmailAuthConfig();
    return {
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: gmailAuthConfig.userEmail,
        ...gmailAuthConfig,
      },
    };
  } else {
    return {
      host: process.env.SMTP_HOST as string,
      port: 465,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL as string,
        pass: process.env.SMTP_PASSWORD as string,
      },
      tls: {
        rejectUnauthorized: false,
      },
    };
  }
}

/**
 * Retrieves Gmail OAuth2 authentication configuration.
 * @returns Promise<GmailAuthConfig> Promise resolving to Gmail OAuth2 authentication configuration.
 */
async function getGmailAuthConfig(): Promise<GmailAuthConfig> {
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL, REFRESH_TOKEN, SMTP_EMAIL } = process.env;
  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URL || !REFRESH_TOKEN || !SMTP_EMAIL) {
    throw new Error("Missing environment variables for Gmail configuration");
  }
  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  const accessToken = await oAuth2Client.getAccessToken();
  return {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUrl: REDIRECT_URL,
    refreshToken: REFRESH_TOKEN,
    userEmail: SMTP_EMAIL,
    accessToken: accessToken.token || "",
  };
}

/**
 * Builds nodemailer mail options based on provided email options.
 * @param emailOptions Options for sending the email.
 * @returns SendMailOptions Nodemailer mail options.
 */
function buildMailOptions(emailOptions: EmailOptions): SendMailOptions {
  const { html, template, context } = emailOptions;
  const mailOptions: SendMailOptions = {
    from: process.env.SMTP_EMAIL as string,
    to: emailOptions.to,
    subject: emailOptions.subject,
  };
  if (emailOptions.bcc) mailOptions.bcc = emailOptions.bcc;
  if (emailOptions.attachments) mailOptions.attachments = emailOptions.attachments;

  if (html) mailOptions.html = html;
  if (template) {
    const templateFile = path.join(__dirname, "templates", `${template}.ejs`);
    if (!fs.existsSync(templateFile)) throw new Error(`${template} is not a valid template`);
    const file = fs.readFileSync(templateFile, "utf-8");
    const ejsCompile = ejs.compile(file);
    const html = ejsCompile({ ...context });
    mailOptions.html = html;
  }
  return mailOptions;
}

export default sendEmail;
