const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  console.log("🔹 Incoming Request Method:", req.method);

  // ✅ จัดการ Preflight Request (OPTIONS)
  if (req.method === "OPTIONS") {
    console.log("🟡 Handling Preflight Request (OPTIONS)");
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS"); // ✅ วิธีที่ถูกต้อง
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end(); // ✅ ตอบกลับ OK สำหรับ OPTIONS
  }

  // ✅ กำหนด CORS Headers สำหรับทุก request
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method !== "POST") {
    console.error("❌ Method Not Allowed:", req.method);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    console.log("🔹 Received request body:", req.body);

    const { price_id } = req.body;
    if (!price_id) {
      console.error("❌ Missing price_id");
      return res.status(400).json({ error: "Missing price_id" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["promptpay"],
      line_items: [{ price: price_id, quantity: 1 }],
      mode: "payment",
      success_url: `${process.env.YOUR_DOMAIN}/success.html`,
      cancel_url: `${process.env.YOUR_DOMAIN}/cancel.html`,
    });

    console.log("✅ Checkout session created:", session.url);
    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error("🔥 Error creating checkout session:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
