const nodemailer = require("nodemailer");
// set up the transporter with gmail and env creds
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendPriceAlert(email, product, currentPrice, targetPrice) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Price Alert! ${product.title} is now $${currentPrice.toFixed(
        2
      )}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #3b82f6;">PricePulse Alert</h2>
          <p>hey, the product you're watching just dropped below your target price.</p>
          <h3>${product.title}</h3>
          ${
            product.image_url
              ? `<img src="${product.image_url}" width="200">`
              : ""
          }
          <p>current price: $${currentPrice.toFixed(2)}</p>
          <p>your target: $${targetPrice.toFixed(2)}</p>
          <a href="${
            product.url
          }" style="background: #3b82f6; color: white; padding: 10px; text-decoration: none;">
            check it out
          </a>
        </div>
      `,
    });

    console.log(`alert sent to ${email}`);
    return true;
  } catch (err) {
    console.error("couldn't send email:", err);
    return false;
  }
}

module.exports = { sendPriceAlert };
