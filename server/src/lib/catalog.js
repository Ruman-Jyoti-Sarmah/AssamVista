import {
  PRODUCTS,
  SHIPPING,
  calculateShipping,
} from "../../../src/data/marketplace/catalogue.js";

const PRODUCT_BY_SLUG = new Map(PRODUCTS.map((p) => [p.slug, p]));

export function getCatalogProduct(slug) {
  return PRODUCT_BY_SLUG.get(String(slug || "")) || null;
}

export function buildServerOrderItems(items) {
  if (!Array.isArray(items) || !items.length) {
    return { error: "Cart is empty." };
  }
  const normalized = [];
  let subtotal = 0;
  for (const raw of items) {
    const slug = String(raw?.slug || "").trim();
    const qty = Number(raw?.qty);
    if (!slug) return { error: "Invalid cart item." };
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      return { error: "Invalid item quantity." };
    }
    const product = getCatalogProduct(slug);
    if (!product) return { error: `Unknown product: ${slug}` };
    const unitPrice = Number(product.price);
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      return { error: "Invalid product price." };
    }
    const lineSubtotal = unitPrice * qty;
    subtotal += lineSubtotal;
    normalized.push({
      slug: product.slug,
      name: product.name,
      localName: product.localName || "",
      qty,
      unitPrice,
      subtotal: lineSubtotal,
      image: product.image || "",
      category: product.category || "",
    });
  }
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;
  return { items: normalized, subtotal, shipping, total, currency: "INR" };
}

export function validateCustomer(customer) {
  const c = customer && typeof customer === "object" ? customer : {};
  const fullName = String(c.fullName || "").trim().slice(0, 80);
  const phone = String(c.phone || "").trim().slice(0, 20);
  const email = String(c.email || "").trim().slice(0, 120);
  const address = String(c.address || "").trim().slice(0, 300);
  const city = String(c.city || "").trim().slice(0, 80);
  const district = String(c.district || "").trim().slice(0, 80);
  const pincode = String(c.pincode || "").trim().slice(0, 10);
  const notes = String(c.notes || "").trim().slice(0, 500);
  const paymentMethod = String(c.paymentMethod || "").trim().toLowerCase();

  if (fullName.length < 2) return { error: "Full name is required." };
  if (!/^[0-9+\-\s]{8,15}$/.test(phone)) return { error: "Valid phone number is required." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Invalid email address." };
  if (address.length < 6) return { error: "Delivery address is required." };
  if (city.length < 2) return { error: "City is required." };
  if (!district) return { error: "District is required." };
  if (!/^[0-9]{6}$/.test(pincode)) return { error: "Valid 6-digit pincode is required." };
  if (!["cod", "upi", "card"].includes(paymentMethod)) {
    return { error: "Select a valid payment preference." };
  }

  return {
    customer: { fullName, phone, email, address, city, district, pincode, notes, paymentMethod },
  };
}

export { SHIPPING };
