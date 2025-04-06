const nodemailer = require('nodemailer');
const env = require('../../config/env');
const logger = require('../../config/logger');

// Create a transporter based on environment
const createTransporter = () => {
  // For production, use SMTP settings from env variables
  if (env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      secure: env.EMAIL_SECURE === 'true',
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
      },
    });
  }
  
  // For development/testing, use ethereal.email (fake SMTP service)
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: env.EMAIL_USER || 'test@example.com',
      pass: env.EMAIL_PASSWORD || 'testpassword',
    },
  });
};

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.text - Plain text content
 * @param {String} options.html - HTML content
 * @returns {Promise<Object>} - Email send info
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: env.EMAIL_FROM || 'Quizlet <noreply@quizlet.example.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    // Log success but not in production (to avoid logging sensitive data)
    if (env.NODE_ENV !== 'production') {
      logger.info(`Email sent: ${info.messageId}`);
      // For development using Ethereal, log preview URL
      logger.info(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } else {
      logger.info(`Email sent to ${options.to}`);
    }
    
    return info;
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    throw error;
  }
};

/**
 * Send a password reset email
 * @param {String} email - User email
 * @param {String} resetToken - Password reset token
 * @param {String} username - User's name
 * @returns {Promise<Object>} - Email send info
 */
const sendPasswordResetEmail = async (email, resetToken, username) => {
  const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;
  
  const subject = 'Password Reset Request';
  
  const text = `Hello ${username},
  
You requested a password reset for your Quizlet account. Please use the following link to reset your password:
  
${resetUrl}
  
This link is valid for 10 minutes. If you didn't request this, please ignore this email and your password will remain unchanged.
  
Regards,
The Quizlet Team`;
  
  const html = `
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
    <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
      <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
      <p>Hello ${username},</p>
      <p>You requested a password reset for your Quizlet account. Please click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px;">Reset Password</a>
      </div>
      <p>Or copy and paste this link in your browser:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link is valid for 10 minutes. If you didn't request this, please ignore this email and your password will remain unchanged.</p>
      <p>Regards,<br>The Quizlet Team</p>
    </div>
    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
      <p>© ${new Date().getFullYear()} Quizlet. All rights reserved.</p>
    </div>
  </div>
  `;
  
  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};

/**
 * Send a welcome email
 * @param {String} email - User email
 * @param {String} username - User's name
 * @returns {Promise<Object>} - Email send info
 */
const sendWelcomeEmail = async (email, username) => {
  const subject = 'Welcome to Quizlet!';
  
  const text = `Hello ${username},
  
Thank you for joining Quizlet! We're excited to have you on board.

Get started by creating your first flashcard set or exploring the features available.

If you have any questions, please don't hesitate to contact our support team.

Regards,
The Quizlet Team`;
  
  const html = `
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
    <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
      <h2 style="color: #333; margin-top: 0;">Welcome to Quizlet!</h2>
      <p>Hello ${username},</p>
      <p>Thank you for joining Quizlet! We're excited to have you on board.</p>
      <p>Get started by creating your first flashcard set or exploring the features available.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${env.CLIENT_URL}/dashboard" style="background-color: #4CAF50; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px;">Go to Dashboard</a>
      </div>
      <p>If you have any questions, please don't hesitate to contact our support team.</p>
      <p>Regards,<br>The Quizlet Team</p>
    </div>
    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
      <p>© ${new Date().getFullYear()} Quizlet. All rights reserved.</p>
    </div>
  </div>
  `;
  
  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
}; 