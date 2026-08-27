import { Order, RestaurantSettings } from '../types';

/**
 * Generates the clean formatted WhatsApp order text and the wa.me URL
 */
export function generateWhatsAppOrderMessage(order: Order, settings: RestaurantSettings): string {
  const lineSeparator = '--------------------------------';
  
  let message = `🍽️ *NEW ORDER - ${settings.restaurant_name.toUpperCase()}*\n`;
  message += `*Order ID:* #${order.order_number}\n`;
  message += `*Date:* ${new Date(order.created_at).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })}\n`;
  message += `${lineSeparator}\n\n`;

  message += `📋 *ORDER ITEMS:*\n`;
  order.items.forEach((item, index) => {
    const vegBadge = item.veg ? '🟢 [Veg]' : '🔴 [Non-Veg]';
    message += `${index + 1}. *${item.product_name}* × ${item.quantity}  (₹${item.unit_price * item.quantity})\n`;
    
    // Add customizations if any
    const customParts: string[] = [];
    if (item.customizations.spice_level) {
      customParts.push(`Spice: ${item.customizations.spice_level.toUpperCase()}`);
    }
    if (item.customizations.addons && item.customizations.addons.length > 0) {
      const addonsStr = item.customizations.addons.map(a => `+${a.name} (₹${a.price})`).join(', ');
      customParts.push(`Add-ons: ${addonsStr}`);
    }
    if (item.customizations.special_instructions) {
      customParts.push(`Note: "${item.customizations.special_instructions}"`);
    }

    if (customParts.length > 0) {
      message += `   └ _${customParts.join(' | ')}_\n`;
    }
  });

  message += `\n${lineSeparator}\n`;
  message += `💰 *BILL SUMMARY:*\n`;
  message += `• *Subtotal:* ₹${order.subtotal}\n`;
  message += `• *Delivery Fee:* ${order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee}`}\n`;
  if (order.discount > 0) {
    message += `• *Discount (${order.discount_code || 'PROMO'}):* -₹${order.discount}\n`;
  }
  message += `*TOTAL PAYABLE:* ₹${order.total}\n`;
  message += `*Payment Mode:* ${
    order.payment_method === 'whatsapp' 
      ? 'Pay on WhatsApp Confirmation' 
      : order.payment_method === 'cod' 
      ? 'Cash on Delivery (COD)' 
      : 'UPI QR on Delivery'
  }\n`;
  message += `${lineSeparator}\n\n`;

  message += `📍 *CUSTOMER & DELIVERY DETAILS:*\n`;
  message += `• *Name:* ${order.customer_name}\n`;
  message += `• *Phone:* ${order.phone}\n`;
  if (order.email) {
    message += `• *Email:* ${order.email}\n`;
  }
  message += `• *Address:* ${order.delivery_address}\n`;
  if (order.landmark) {
    message += `• *Landmark:* ${order.landmark}\n`;
  }
  message += `• *City/Pincode:* ${order.city} - ${order.pincode}\n`;
  if (order.delivery_instructions) {
    message += `• *Instructions:* ${order.delivery_instructions}\n`;
  }

  message += `\n${lineSeparator}\n`;
  message += `🙏 _Please confirm my order and share the estimated preparation time. Thank you!_`;

  return message;
}

/**
 * Sanitizes phone number and opens WhatsApp web/app in a new tab/window
 */
export function openWhatsAppOrder(order: Order, settings: RestaurantSettings): string {
  const message = generateWhatsAppOrderMessage(order, settings);
  const cleanPhone = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);
  
  // Return standard WhatsApp web link
  const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
  return url;
}

/**
 * Checks if restaurant is currently open based on business hours and overrides
 */
export function isRestaurantOpen(settings: RestaurantSettings): { isOpen: boolean; message: string } {
  if (settings.is_open_override === true) {
    return { isOpen: true, message: 'Restaurant is open now' };
  }
  if (settings.is_open_override === false) {
    return { 
      isOpen: false, 
      message: settings.closed_message || 'Currently Closed for orders' 
    };
  }

  try {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTotalMinutes = currentHours * 60 + currentMinutes;

    const [openH, openM] = settings.open_time.split(':').map(Number);
    const [closeH, closeM] = settings.close_time.split(':').map(Number);

    const openTotalMinutes = openH * 60 + (openM || 0);
    const closeTotalMinutes = closeH * 60 + (closeM || 0);

    if (currentTotalMinutes >= openTotalMinutes && currentTotalMinutes < closeTotalMinutes) {
      return { isOpen: true, message: 'Restaurant is open now' };
    } else {
      return { 
        isOpen: false, 
        message: `Currently Closed. Orders will resume at ${formatTime12Hour(settings.open_time)}.` 
      };
    }
  } catch {
    return { isOpen: true, message: 'Restaurant is open now' };
  }
}

export function formatTime12Hour(time24: string): string {
  try {
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const minStr = m ? `:${m < 10 ? '0' + m : m}` : ':00';
    return `${hour12}${minStr} ${period}`;
  } catch {
    return time24;
  }
}
