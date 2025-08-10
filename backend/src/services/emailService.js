const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initializeTransporter();
  }

  /**
   * Initialize email transporter
   */
  async initializeTransporter() {
    try {
      // Check if email configuration is available
      const emailConfig = {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      };

      // Validate required configuration
      if (!emailConfig.host || !emailConfig.auth.user || !emailConfig.auth.pass) {
        logger.warn('Email service not configured - missing SMTP credentials');
        this.isConfigured = false;
        return;
      }

      // Create transporter
      this.transporter = nodemailer.createTransporter(emailConfig);

      // Verify connection
      await this.transporter.verify();
      this.isConfigured = true;
      logger.info('Email service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize email service:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Send email
   */
  async sendEmail(options) {
    try {
      if (!this.isConfigured || !this.transporter) {
        throw new Error('Email service not configured');
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${options.to}`);
      
      return result;
    } catch (error) {
      logger.error(`Failed to send email to ${options.to}:`, error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(user) {
    try {
      const subject = 'Welcome to CV Analyzer!';
      const text = `
        Hi ${user.firstName},
        
        Welcome to CV Analyzer! We're excited to have you on board.
        
        Get started by uploading your first CV and analyzing it to improve your job applications.
        
        Best regards,
        The CV Analyzer Team
      `;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to CV Analyzer!</h2>
          <p>Hi ${user.firstName},</p>
          <p>Welcome to CV Analyzer! We're excited to have you on board.</p>
          <p>Get started by uploading your first CV and analyzing it to improve your job applications.</p>
          <br>
          <p>Best regards,<br>The CV Analyzer Team</p>
        </div>
      `;

      await this.sendEmail({
        to: user.email,
        subject,
        text,
        html
      });

      logger.info(`Welcome email sent to ${user.email}`);
    } catch (error) {
      logger.error(`Failed to send welcome email to ${user.email}:`, error);
      // Don't throw error for welcome email failures
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(user, resetToken) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
      
      const subject = 'Password Reset Request - CV Analyzer';
      const text = `
        Hi ${user.firstName},
        
        You requested a password reset for your CV Analyzer account.
        
        Click the following link to reset your password:
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request this reset, please ignore this email.
        
        Best regards,
        The CV Analyzer Team
      `;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hi ${user.firstName},</p>
          <p>You requested a password reset for your CV Analyzer account.</p>
          <p>Click the following button to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <br>
          <p>Best regards,<br>The CV Analyzer Team</p>
        </div>
      `;

      await this.sendEmail({
        to: user.email,
        subject,
        text,
        html
      });

      logger.info(`Password reset email sent to ${user.email}`);
    } catch (error) {
      logger.error(`Failed to send password reset email to ${user.email}:`, error);
      throw error;
    }
  }

  /**
   * Send CV analysis completion email
   */
  async sendAnalysisCompletionEmail(user, analysis, cv) {
    try {
      const subject = `CV Analysis Complete - ${cv.originalName}`;
      const text = `
        Hi ${user.firstName},
        
        Your CV analysis for "${cv.originalName}" has been completed!
        
        Analysis Type: ${analysis.analysisType}
        Score: ${analysis.results.score}/100
        
        View your detailed results in the CV Analyzer dashboard.
        
        Best regards,
        The CV Analyzer Team
      `;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">CV Analysis Complete!</h2>
          <p>Hi ${user.firstName},</p>
          <p>Your CV analysis for "<strong>${cv.originalName}</strong>" has been completed!</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Analysis Type:</strong> ${analysis.analysisType}</p>
            <p><strong>Score:</strong> ${analysis.results.score}/100</p>
          </div>
          <p>View your detailed results in the CV Analyzer dashboard.</p>
          <br>
          <p>Best regards,<br>The CV Analyzer Team</p>
        </div>
      `;

      await this.sendEmail({
        to: user.email,
        subject,
        text,
        html
      });

      logger.info(`Analysis completion email sent to ${user.email}`);
    } catch (error) {
      logger.error(`Failed to send analysis completion email to ${user.email}:`, error);
      // Don't throw error for notification email failures
    }
  }

  /**
   * Send CV analysis failure email
   */
  async sendAnalysisFailureEmail(user, analysis, cv, error) {
    try {
      const subject = `CV Analysis Failed - ${cv.originalName}`;
      const text = `
        Hi ${user.firstName},
        
        Unfortunately, your CV analysis for "${cv.originalName}" has failed.
        
        Error: ${error}
        
        Please try uploading your CV again or contact support if the problem persists.
        
        Best regards,
        The CV Analyzer Team
      `;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">CV Analysis Failed</h2>
          <p>Hi ${user.firstName},</p>
          <p>Unfortunately, your CV analysis for "<strong>${cv.originalName}</strong>" has failed.</p>
          <div style="background-color: #f8d7da; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <p><strong>Error:</strong> ${error}</p>
          </div>
          <p>Please try uploading your CV again or contact support if the problem persists.</p>
          <br>
          <p>Best regards,<br>The CV Analyzer Team</p>
        </div>
      `;

      await this.sendEmail({
        to: user.email,
        subject,
        text,
        html
      });

      logger.info(`Analysis failure email sent to ${user.email}`);
    } catch (error) {
      logger.error(`Failed to send analysis failure email to ${user.email}:`, error);
      // Don't throw error for notification email failures
    }
  }

  /**
   * Send weekly summary email
   */
  async sendWeeklySummaryEmail(user, summary) {
    try {
      const subject = 'Your Weekly CV Analysis Summary';
      const text = `
        Hi ${user.firstName},
        
        Here's your weekly CV analysis summary:
        
        Total CVs Analyzed: ${summary.totalAnalyses}
        Average Score: ${summary.averageScore}/100
        New Recommendations: ${summary.newRecommendations}
        
        Keep improving your CVs to boost your job applications!
        
        Best regards,
        The CV Analyzer Team
      `;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Weekly CV Analysis Summary</h2>
          <p>Hi ${user.firstName},</p>
          <p>Here's your weekly CV analysis summary:</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Total CVs Analyzed:</strong> ${summary.totalAnalyses}</p>
            <p><strong>Average Score:</strong> ${summary.averageScore}/100</p>
            <p><strong>New Recommendations:</strong> ${summary.newRecommendations}</p>
          </div>
          <p>Keep improving your CVs to boost your job applications!</p>
          <br>
          <p>Best regards,<br>The CV Analyzer Team</p>
        </div>
      `;

      await this.sendEmail({
        to: user.email,
        subject,
        text,
        html
      });

      logger.info(`Weekly summary email sent to ${user.email}`);
    } catch (error) {
      logger.error(`Failed to send weekly summary email to ${user.email}:`, error);
      // Don't throw error for summary email failures
    }
  }

  /**
   * Send account verification email
   */
  async sendVerificationEmail(user, verificationToken) {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(user.email)}`;
      
      const subject = 'Verify Your Email - CV Analyzer';
      const text = `
        Hi ${user.firstName},
        
        Please verify your email address to complete your CV Analyzer account setup.
        
        Click the following link to verify your email:
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        Best regards,
        The CV Analyzer Team
      `;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p>Hi ${user.firstName},</p>
          <p>Please verify your email address to complete your CV Analyzer account setup.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
          </div>
          <p>This link will expire in 24 hours.</p>
          <br>
          <p>Best regards,<br>The CV Analyzer Team</p>
        </div>
      `;

      await this.sendEmail({
        to: user.email,
        subject,
        text,
        html
      });

      logger.info(`Verification email sent to ${user.email}`);
    } catch (error) {
      logger.error(`Failed to send verification email to ${user.email}:`, error);
      throw error;
    }
  }

  /**
   * Send support notification email
   */
  async sendSupportNotification(user, issue) {
    try {
      const subject = 'Support Request Received - CV Analyzer';
      const text = `
        Hi ${user.firstName},
        
        We've received your support request and our team is working on it.
        
        Issue: ${issue.description}
        Priority: ${issue.priority}
        Ticket ID: ${issue.ticketId}
        
        We'll get back to you within 24 hours.
        
        Best regards,
        The CV Analyzer Support Team
      `;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Support Request Received</h2>
          <p>Hi ${user.firstName},</p>
          <p>We've received your support request and our team is working on it.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Issue:</strong> ${issue.description}</p>
            <p><strong>Priority:</strong> ${issue.priority}</p>
            <p><strong>Ticket ID:</strong> ${issue.ticketId}</p>
          </div>
          <p>We'll get back to you within 24 hours.</p>
          <br>
          <p>Best regards,<br>The CV Analyzer Support Team</p>
        </div>
      `;

      await this.sendEmail({
        to: user.email,
        subject,
        text,
        html
      });

      logger.info(`Support notification email sent to ${user.email}`);
    } catch (error) {
      logger.error(`Failed to send support notification email to ${user.email}:`, error);
      // Don't throw error for notification email failures
    }
  }

  /**
   * Check if email service is configured
   */
  isEmailServiceConfigured() {
    return this.isConfigured;
  }

  /**
   * Get email service status
   */
  getEmailServiceStatus() {
    return {
      configured: this.isConfigured,
      transporter: !!this.transporter,
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT,
      smtpUser: process.env.SMTP_USER ? '***configured***' : 'not configured'
    };
  }
}

module.exports = EmailService;
