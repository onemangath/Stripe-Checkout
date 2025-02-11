const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // ให้ทุกเว็บเรียกได้ หรือกำหนดเป็นโดเมนของคุณ
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Origin", "Content-Type");
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log("🔹 Received request body:", req.body);  // ✅ Debug ดูว่ามี price_id ไหม

    const { price_id } = req.body;
    if (!price_id) {
      console.error("❌ Missing price_id");
      return res.status(400).json({ error: 'Missing price_id' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['promptpay'],  // ✅ ลองใช้ 'card' ก่อน
      line_items: [{ price: price_id, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.YOUR_DOMAIN}/success.html`,
      cancel_url: `${process.env.YOUR_DOMAIN}/cancel.html`,
    });

    console.log("✅ Checkout session created:", session.url);  // ✅ ดูว่ามันสร้างลิงก์ได้ไหม
    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error("🔥 Error creating checkout session:", error);  // ✅ Log error
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}