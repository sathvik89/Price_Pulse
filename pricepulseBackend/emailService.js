const nodemailer = require("nodemailer");

// Fix: createTransport (not createTransporter)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendPriceAlert(email, product, currentPrice, targetPrice) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `🎉 Price Drop Alert: ${product.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3b82f6;">🚨 PricePulse Alert!</h2>
          
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            ${
              product.image_url
                ? `<img src="${product.image_url}" alt="${product.title}" style="max-width: 200px; height: auto; margin-bottom: 15px;">`
                : ""
            }
            
            <h3 style="color: #1f2937; margin-bottom: 10px;">${
              product.title
            }</h3>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 5px 0;"><strong>Current Price:</strong> <span style="color: #059669; font-size: 18px;">₹${currentPrice}</span></p>
              <p style="margin: 5px 0;"><strong>Your Target:</strong> ₹${targetPrice}</p>
              <p style="margin: 5px 0; color: #059669;"><strong>✅ Target Reached!</strong></p>
            </div>
            
            <a href="${
              product.url
            }" style="display: inline-block; background-color: #ff9500; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px;">
              View on Amazon
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
            This alert was sent by PricePulse. The price may change frequently.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Price alert email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}

module.exports = { sendPriceAlert };
