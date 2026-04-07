import { Resend } from 'resend';
import { env } from '../config/env';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const sendEmail = async (to: string, subject: string, html: string) => {
  if (!resend) {
    console.log(`[Email skipped — no RESEND_API_KEY] To: ${to} | Subject: ${subject}`);
    return;
  }
  try {
    await resend.emails.send({
      from: `OpticHub <${env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('Email send failed:', err);
  }
};

export const sendOrderConfirmation = async (
  to: string,
  customerName: string,
  orderId: string,
  items: OrderItem[],
  subtotal: number,
  shippingCost: number,
  total: number,
  shippingAddress: ShippingAddress
) => {
  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
          <span style="font-weight:600;color:#111827;">${item.name}</span>
          <span style="color:#6b7280;font-size:13px;"> × ${item.quantity}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:600;color:#111827;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>`
    )
    .join('');

  const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
    <!-- Header -->
    <div style="background:#111827;padding:32px 40px;text-align:center;border-radius:12px 12px 0 0;">
      <p style="margin:0;font-size:28px;">🕶️</p>
      <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">
        Optic<span style="color:#f59e0b;">Hub</span>
      </h1>
    </div>

    <!-- Body -->
    <div style="padding:40px;background:#ffffff;">
      <h2 style="margin:0 0 8px;font-size:20px;color:#111827;">Order Confirmed!</h2>
      <p style="margin:0 0 24px;color:#6b7280;">Hi ${customerName}, thanks for your order. We'll notify you when it ships.</p>

      <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#6b7280;">Order ID</p>
        <p style="margin:4px 0 0;font-weight:700;color:#111827;font-size:15px;">#${orderId.slice(-8).toUpperCase()}</p>
      </div>

      <!-- Items -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${itemRows}
        <tr>
          <td style="padding:10px 0;color:#6b7280;font-size:14px;">Subtotal</td>
          <td style="padding:10px 0;text-align:right;color:#6b7280;font-size:14px;">$${subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:14px;">Shipping</td>
          <td style="padding:4px 0;text-align:right;color:#6b7280;font-size:14px;">${shippingCost === 0 ? 'Free' : '$' + shippingCost.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:12px 0 0;font-size:16px;font-weight:700;color:#111827;">Total</td>
          <td style="padding:12px 0 0;text-align:right;font-size:16px;font-weight:700;color:#111827;">$${total.toFixed(2)}</td>
        </tr>
      </table>

      <!-- Shipping address -->
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin-bottom:32px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:.05em;">Shipping To</p>
        <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">
          ${shippingAddress.fullName}<br/>
          ${shippingAddress.address}<br/>
          ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br/>
          ${shippingAddress.country}
        </p>
      </div>

      <a href="${env.CLIENT_URL}/orders/${orderId}"
        style="display:inline-block;background:#f59e0b;color:#ffffff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:100px;text-decoration:none;">
        View Order →
      </a>
    </div>

    <!-- Footer -->
    <div style="padding:24px 40px;background:#f9fafb;border-radius:0 0 12px 12px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} OpticHub. All rights reserved.</p>
    </div>
  </div>`;

  await sendEmail(to, `Order Confirmed — #${orderId.slice(-8).toUpperCase()}`, html);
};

export const sendStatusUpdate = async (
  to: string,
  customerName: string,
  orderId: string,
  status: string
) => {
  const statusConfig: Record<string, { emoji: string; title: string; message: string; color: string }> = {
    processing: {
      emoji: '⚙️',
      title: 'Your order is being processed',
      message: "We're preparing your order. You'll hear from us once it ships.",
      color: '#8b5cf6',
    },
    shipped: {
      emoji: '🚚',
      title: "Your order has shipped!",
      message: "Your frames are on the way. Check your tracking info for updates.",
      color: '#3b82f6',
    },
    delivered: {
      emoji: '✅',
      title: 'Your order has been delivered!',
      message: 'Your OpticHub order has arrived. Enjoy your new frames!',
      color: '#10b981',
    },
    cancelled: {
      emoji: '❌',
      title: 'Your order has been cancelled',
      message: "Your order has been cancelled. If you have questions, please contact support.",
      color: '#ef4444',
    },
  };

  const cfg = statusConfig[status];
  if (!cfg) return; // don't send email for 'paid' or unknown statuses

  const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:#111827;padding:32px 40px;text-align:center;border-radius:12px 12px 0 0;">
      <p style="margin:0;font-size:28px;">🕶️</p>
      <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">
        Optic<span style="color:#f59e0b;">Hub</span>
      </h1>
    </div>

    <div style="padding:40px;background:#ffffff;text-align:center;">
      <p style="font-size:48px;margin:0 0 16px;">${cfg.emoji}</p>
      <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">${cfg.title}</h2>
      <p style="margin:0 0 8px;color:#6b7280;">${cfg.message}</p>
      <p style="margin:0 0 32px;font-size:13px;color:#9ca3af;">Order #${orderId.slice(-8).toUpperCase()}</p>

      <a href="${env.CLIENT_URL}/orders/${orderId}"
        style="display:inline-block;background:${cfg.color};color:#ffffff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:100px;text-decoration:none;">
        View Order →
      </a>
    </div>

    <div style="padding:24px 40px;background:#f9fafb;border-radius:0 0 12px 12px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} OpticHub. All rights reserved.</p>
    </div>
  </div>`;

  await sendEmail(to, `${cfg.emoji} Order Update — #${orderId.slice(-8).toUpperCase()}`, html);
};
