import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import Razorpay from "razorpay";
import { data, save, nextId } from "./db.js";
import { seed } from "./seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-server-env";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*"; // comma separated list, or *
const CURRENCY = process.env.CURRENCY || "INR";
const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB) || 8;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@euphoria.com").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const cloudinaryOn = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);
if (cloudinaryOn) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const razorpayOn = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
const razorpay = razorpayOn
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

// Coupon the cart advertises (code + percent come from .env)
const COUPONS = {
  [String(process.env.COUPON_CODE || "ROYAL15").toUpperCase()]:
    (Number(process.env.COUPON_PERCENT) || 20) / 100,
};

// ---------- bootstrap ----------
seed();
if (!data.users.some((u) => u.email === ADMIN_EMAIL)) {
  data.users.push({
    id: nextId("users"),
    name: "Admin",
    email: ADMIN_EMAIL,
    password: bcrypt.hashSync(ADMIN_PASSWORD, 10),
    role: "admin",
    blocked: false,
    loginCount: 0,
    lastLogin: null,
    createdAt: new Date().toISOString(),
  });
  save();
  console.log(`Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

// ---------- helpers ----------
const app = express();
app.use(
  cors({
    origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN.split(",").map((s) => s.trim()),
  })
);
app.use(express.json());
const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(uploadDir));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 } });

const bad = (res, message, status = 400) =>
  res.status(status).json({ success: false, message, error: { details: [{ message }] } });

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
});

const auth = (req, res, next) => {
  const raw = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  try {
    const payload = jwt.verify(raw, JWT_SECRET);
    const user = data.users.find((u) => u.id === payload.id);
    if (!user || user.blocked) return bad(res, "Account unavailable", 401);
    req.user = user;
    next();
  } catch {
    bad(res, "Please log in again", 401);
  }
};
const adminOnly = (req, res, next) =>
  req.user.role === "admin" ? next() : bad(res, "Admin access only", 403);

const catOf = (id) => data.categories.find((c) => c.id === id);
const shapeProduct = (p) => {
  const c = catOf(p.categoryId);
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: c?.name || "Uncategorised",
    categoryId: p.categoryId,
    group: c?.group || "women",
    images: p.images,
    first: p.images[0] || "",
    second: p.images[1] || p.images[0] || "",
    stock: p.stock,
    status: p.status,
    featured: !!p.featured,
    createdAt: p.createdAt,
  };
};

const day = (iso) => iso.slice(0, 10);
const lastDays = (n) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });

// ---------- auth ----------
app.post("/auth/signup", (req, res) => {
  const { name = "", email = "", password = "" } = req.body || {};
  if (name.trim().length < 3) return bad(res, "Name must be at least 3 characters");
  if (!/^\S+@\S+\.\S+$/.test(email)) return bad(res, "Enter a valid email address");
  if (password.length < 4) return bad(res, "Password must be at least 4 characters");
  const mail = email.trim().toLowerCase();
  if (data.users.some((u) => u.email === mail))
    return res.status(409).json({ success: false, message: "User already exists, please log in" });
  data.users.push({
    id: nextId("users"),
    name: name.trim(),
    email: mail,
    password: bcrypt.hashSync(password, 10),
    role: "user",
    blocked: false,
    loginCount: 0,
    lastLogin: null,
    createdAt: new Date().toISOString(),
  });
  save();
  res.status(201).json({ success: true, message: "Signup successful" });
});

app.post("/auth/login", (req, res) => {
  const { email = "", password = "" } = req.body || {};
  if (!email || !password) return bad(res, "Email and password are required");
  const user = data.users.find((u) => u.email === email.trim().toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(403).json({ success: false, message: "Email or password is wrong" });
  if (user.blocked)
    return res.status(403).json({ success: false, message: "This account has been blocked" });
  user.loginCount = (user.loginCount || 0) + 1;
  user.lastLogin = new Date().toISOString();
  (user.logins ||= []).push(user.lastLogin);
  user.logins = user.logins.slice(-200);
  save();
  const jwtToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  res.json({
    success: true,
    message: "Login successful",
    jwtToken,
    email: user.email,
    name: user.name,
    role: user.role,
  });
});

app.get("/auth/me", auth, (req, res) => res.json({ success: true, user: publicUser(req.user) }));

// ---------- public catalog ----------
app.get("/api/config", (_req, res) =>
  res.json({
    razorpayKey: razorpayOn ? process.env.RAZORPAY_KEY_ID : null,
    cloudinary: cloudinaryOn,
  })
);

app.get("/api/categories", (_req, res) => res.json(data.categories));

app.get("/api/products", (_req, res) =>
  res.json(data.products.filter((p) => p.status === "active").map(shapeProduct))
);

app.get("/api/banners", (req, res) => {
  const list = data.banners
    .filter((b) => b.active && (!req.query.section || b.section === req.query.section))
    .sort((a, b) => a.order - b.order);
  res.json(list);
});

app.post("/api/newsletter", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return bad(res, "Enter a valid email address");
  if (!data.subscribers.some((s) => s.email === email)) {
    data.subscribers.push({ id: nextId("subscribers"), email, createdAt: new Date().toISOString() });
    save();
  }
  res.json({ success: true, message: "Subscribed" });
});

// ---------- checkout (Razorpay) ----------
const priceCart = (items, couponCode) => {
  const lines = [];
  for (const it of items || []) {
    const p = data.products.find((x) => x.id === Number(it.id) && x.status === "active");
    const qty = Math.max(1, Math.min(10, Number(it.qty) || 1));
    if (!p) throw new Error("An item in your cart is no longer available");
    if (p.stock < qty) throw new Error(`Only ${p.stock} left of "${p.title}"`);
    lines.push({ productId: p.id, title: p.title, price: p.price, qty, image: p.images[0] || "" });
  }
  if (!lines.length) throw new Error("Your cart is empty");
  const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
  const rate = COUPONS[String(couponCode || "").trim().toUpperCase()] || 0;
  const discount = Math.round(subtotal * rate);
  return { lines, subtotal, discount, total: subtotal - discount, coupon: rate ? String(couponCode).trim().toUpperCase() : null };
};

app.post("/api/orders/create", auth, async (req, res) => {
  if (!razorpayOn)
    return bad(res, "Payments are not configured yet. Add Razorpay keys in server/.env", 503);
  try {
    const { items, couponCode, shipping = {} } = req.body || {};
    if (!shipping.name || !shipping.phone || !shipping.address || !shipping.pincode)
      return bad(res, "Please fill in your delivery details");
    const priced = priceCart(items, couponCode);
    const orderNo = "EU" + String(nextId("orders", 1000)).padStart(5, "0");
    const rp = await razorpay.orders.create({
      amount: priced.total * 100,
      currency: CURRENCY,
      receipt: orderNo,
    });
    const order = {
      id: Number(orderNo.slice(2)),
      orderNo,
      userId: req.user.id,
      customer: { name: req.user.name, email: req.user.email },
      items: priced.lines,
      subtotal: priced.subtotal,
      discount: priced.discount,
      coupon: priced.coupon,
      total: priced.total,
      shipping,
      status: "pending",
      payment: { status: "pending", razorpayOrderId: rp.id, paymentId: null },
      createdAt: new Date().toISOString(),
    };
    data.orders.push(order);
    save();
    res.json({
      success: true,
      orderId: order.id,
      razorpayOrderId: rp.id,
      amount: rp.amount,
      currency: rp.currency,
      key: process.env.RAZORPAY_KEY_ID,
      orderNo,
    });
  } catch (e) {
    bad(res, e.error?.description || e.message || "Could not start payment");
  }
});

app.post("/api/orders/verify", auth, (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  const order = data.orders.find((o) => o.id === Number(orderId) && o.userId === req.user.id);
  if (!order || order.payment.razorpayOrderId !== razorpay_order_id) return bad(res, "Order not found", 404);
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  if (expected !== razorpay_signature) {
    order.payment.status = "failed";
    save();
    return bad(res, "Payment verification failed");
  }
  if (order.payment.status !== "paid") {
    order.payment = { ...order.payment, status: "paid", paymentId: razorpay_payment_id, paidAt: new Date().toISOString() };
    order.status = "processing";
    for (const l of order.items) {
      const p = data.products.find((x) => x.id === l.productId);
      if (p) p.stock = Math.max(0, p.stock - l.qty);
    }
    save();
  }
  res.json({ success: true, orderNo: order.orderNo });
});

app.get("/api/orders/mine", auth, (req, res) =>
  res.json(data.orders.filter((o) => o.userId === req.user.id && o.payment.status === "paid").reverse())
);

// ---------- admin ----------
const admin = express.Router();
admin.use(auth, adminOnly);

admin.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return bad(res, "No file received");
  try {
    if (cloudinaryOn) {
      const url = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "euphoria", resource_type: "image" }, (err, r) =>
            err ? reject(err) : resolve(r.secure_url)
          )
          .end(req.file.buffer);
      });
      return res.json({ success: true, url, provider: "cloudinary" });
    }
    // fallback so the panel works before Cloudinary keys are added
    const name = `${Date.now()}-${req.file.originalname.replace(/[^\w.-]/g, "_")}`;
    fs.writeFileSync(path.join(uploadDir, name), req.file.buffer);
    res.json({
      success: true,
      url: `${req.protocol}://${req.get("host")}/uploads/${name}`,
      provider: "local",
    });
  } catch (e) {
    bad(res, e.message || "Upload failed", 500);
  }
});

// categories
admin.get("/categories", (_req, res) =>
  res.json(
    data.categories.map((c) => ({
      ...c,
      products: data.products.filter((p) => p.categoryId === c.id).length,
    }))
  )
);
admin.post("/categories", (req, res) => {
  const { name = "", group = "women", image = "" } = req.body || {};
  if (!name.trim()) return bad(res, "Category name is required");
  if (data.categories.some((c) => c.name.toLowerCase() === name.trim().toLowerCase()))
    return bad(res, "Category already exists");
  const cat = { id: nextId("categories"), name: name.trim(), group, image, createdAt: new Date().toISOString() };
  data.categories.push(cat);
  save();
  res.status(201).json(cat);
});
admin.put("/categories/:id", (req, res) => {
  const cat = catOf(Number(req.params.id));
  if (!cat) return bad(res, "Not found", 404);
  const { name, group, image } = req.body || {};
  if (name !== undefined) cat.name = String(name).trim() || cat.name;
  if (group !== undefined) cat.group = group;
  if (image !== undefined) cat.image = image;
  save();
  res.json(cat);
});
admin.delete("/categories/:id", (req, res) => {
  const id = Number(req.params.id);
  if (data.products.some((p) => p.categoryId === id))
    return bad(res, "Move or delete the products in this category first");
  data.categories = data.categories.filter((c) => c.id !== id);
  save();
  res.json({ success: true });
});

// products
admin.get("/products", (_req, res) => res.json(data.products.map(shapeProduct)));
const readProduct = (body, existing = {}) => {
  const title = String(body.title ?? existing.title ?? "").trim();
  const price = Number(body.price ?? existing.price);
  const categoryId = Number(body.categoryId ?? existing.categoryId);
  if (!title) throw new Error("Title is required");
  if (!(price >= 0)) throw new Error("Enter a valid price");
  if (!catOf(categoryId)) throw new Error("Choose a category");
  const images = (body.images ?? existing.images ?? []).filter(Boolean);
  if (!images.length) throw new Error("Upload at least a front image");
  return {
    title,
    price: Math.round(price),
    categoryId,
    description: String(body.description ?? existing.description ?? ""),
    images,
    stock: Math.max(0, Number(body.stock ?? existing.stock ?? 0)),
    status: body.status ?? existing.status ?? "active",
    featured: !!(body.featured ?? existing.featured),
  };
};
admin.post("/products", (req, res) => {
  try {
    const p = { id: nextId("products", 1000), ...readProduct(req.body), createdAt: new Date().toISOString() };
    data.products.push(p);
    save();
    res.status(201).json(shapeProduct(p));
  } catch (e) {
    bad(res, e.message);
  }
});
admin.put("/products/:id", (req, res) => {
  const p = data.products.find((x) => x.id === Number(req.params.id));
  if (!p) return bad(res, "Not found", 404);
  try {
    Object.assign(p, readProduct(req.body, p));
    save();
    res.json(shapeProduct(p));
  } catch (e) {
    bad(res, e.message);
  }
});
admin.delete("/products/:id", (req, res) => {
  data.products = data.products.filter((p) => p.id !== Number(req.params.id));
  save();
  res.json({ success: true });
});

// banners / site images
const SECTIONS = ["hero", "menswear", "promo"];
admin.get("/banners", (_req, res) => res.json([...data.banners].sort((a, b) => a.order - b.order)));
admin.post("/banners", (req, res) => {
  const { section, image, title = "", link = "", active = true } = req.body || {};
  if (!SECTIONS.includes(section)) return bad(res, "Choose a section");
  if (!image) return bad(res, "Upload an image");
  const order = data.banners.filter((b) => b.section === section).length;
  const b = { id: nextId("banners"), section, image, title, link, active: !!active, order, createdAt: new Date().toISOString() };
  data.banners.push(b);
  save();
  res.status(201).json(b);
});
admin.put("/banners/:id", (req, res) => {
  const b = data.banners.find((x) => x.id === Number(req.params.id));
  if (!b) return bad(res, "Not found", 404);
  for (const k of ["section", "image", "title", "link", "active", "order"])
    if (req.body[k] !== undefined) b[k] = req.body[k];
  save();
  res.json(b);
});
admin.delete("/banners/:id", (req, res) => {
  data.banners = data.banners.filter((b) => b.id !== Number(req.params.id));
  save();
  res.json({ success: true });
});

// orders
admin.get("/orders", (_req, res) => res.json([...data.orders].reverse()));
admin.patch("/orders/:id", (req, res) => {
  const o = data.orders.find((x) => x.id === Number(req.params.id));
  if (!o) return bad(res, "Not found", 404);
  const ok = ["processing", "shipped", "delivered", "cancelled"];
  if (!ok.includes(req.body?.status)) return bad(res, "Invalid status");
  o.status = req.body.status;
  save();
  res.json(o);
});

// users
admin.get("/users", (_req, res) =>
  res.json(
    data.users.map((u) => {
      const mine = data.orders.filter((o) => o.userId === u.id && o.payment.status === "paid");
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        blocked: !!u.blocked,
        loginCount: u.loginCount || 0,
        lastLogin: u.lastLogin,
        createdAt: u.createdAt,
        orders: mine.length,
        spent: mine.reduce((n, o) => n + o.total, 0),
      };
    })
  )
);
admin.patch("/users/:id", (req, res) => {
  const u = data.users.find((x) => x.id === Number(req.params.id));
  if (!u) return bad(res, "Not found", 404);
  if (u.id === req.user.id) return bad(res, "You cannot change your own account here");
  if (req.body.blocked !== undefined) u.blocked = !!req.body.blocked;
  if (["user", "admin"].includes(req.body.role)) u.role = req.body.role;
  save();
  res.json({ success: true });
});
admin.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  if (id === req.user.id) return bad(res, "You cannot delete yourself");
  data.users = data.users.filter((u) => u.id !== id);
  save();
  res.json({ success: true });
});

admin.get("/subscribers", (_req, res) => res.json([...data.subscribers].reverse()));

// dashboards
admin.get("/stats", (req, res) => {
  const n = Math.min(90, Math.max(7, Number(req.query.days) || 30));
  const days = lastDays(n);
  const paid = data.orders.filter((o) => o.payment.status === "paid");
  const revenue = paid.reduce((s, o) => s + o.total, 0);
  const customers = data.users.filter((u) => u.role === "user");

  const byDay = (list, get) => {
    const map = Object.fromEntries(days.map((d) => [d, 0]));
    list.forEach((x) => {
      const d = day(get(x));
      if (d in map) map[d] += 1;
    });
    return days.map((d) => ({ date: d, value: map[d] }));
  };

  const revenueByDay = days.map((d) => {
    const list = paid.filter((o) => day(o.payment.paidAt || o.createdAt) === d);
    return { date: d, revenue: list.reduce((s, o) => s + o.total, 0), orders: list.length };
  });

  const prod = {};
  const cat = {};
  paid.forEach((o) =>
    o.items.forEach((l) => {
      prod[l.title] = prod[l.title] || { title: l.title, qty: 0, revenue: 0, image: l.image };
      prod[l.title].qty += l.qty;
      prod[l.title].revenue += l.qty * l.price;
      const p = data.products.find((x) => x.id === l.productId);
      const cname = catOf(p?.categoryId)?.name || "Other";
      cat[cname] = (cat[cname] || 0) + l.qty * l.price;
    })
  );

  const statusCount = {};
  data.orders.forEach((o) => {
    const k = o.payment.status === "paid" ? o.status : o.payment.status === "failed" ? "failed" : "unpaid";
    statusCount[k] = (statusCount[k] || 0) + 1;
  });

  const since = (d) => Date.now() - d * 86400000;
  const buyers = new Set(paid.map((o) => o.userId));
  const repeat = [...buyers].filter((id) => paid.filter((o) => o.userId === id).length > 1).length;
  const loginsByDay = (() => {
    const map = Object.fromEntries(days.map((d) => [d, 0]));
    data.users.forEach((u) => (u.logins || []).forEach((t) => day(t) in map && (map[day(t)] += 1)));
    return days.map((d) => ({ date: d, value: map[d] }));
  })();

  res.json({
    days: n,
    sales: {
      revenue,
      orders: paid.length,
      avgOrder: paid.length ? Math.round(revenue / paid.length) : 0,
      itemsSold: paid.reduce((s, o) => s + o.items.reduce((a, l) => a + l.qty, 0), 0),
      revenueByDay,
      topProducts: Object.values(prod).sort((a, b) => b.qty - a.qty).slice(0, 5),
      byCategory: Object.entries(cat).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
      statusCount,
    },
    users: {
      total: customers.length,
      blocked: customers.filter((u) => u.blocked).length,
      new7: customers.filter((u) => new Date(u.createdAt) > since(7)).length,
      new30: customers.filter((u) => new Date(u.createdAt) > since(30)).length,
      totalLogins: data.users.reduce((s, u) => s + (u.loginCount || 0), 0),
      signupsByDay: byDay(customers, (u) => u.createdAt),
      loginsByDay,
    },
    marketing: {
      subscribers: data.subscribers.length,
      subscribersByDay: byDay(data.subscribers, (s) => s.createdAt),
      couponOrders: paid.filter((o) => o.coupon).length,
      discountGiven: paid.reduce((s, o) => s + (o.discount || 0), 0),
      conversion: customers.length ? Math.round((buyers.size / customers.length) * 1000) / 10 : 0,
      repeatCustomers: repeat,
    },
    catalog: {
      products: data.products.length,
      active: data.products.filter((p) => p.status === "active").length,
      lowStock: data.products.filter((p) => p.stock <= 5).length,
      categories: data.categories.length,
    },
  });
});

app.use("/api/admin", admin);

app.listen(PORT, () => {
  console.log(`Euphoria API running on http://localhost:${PORT}`);
  console.log(`Cloudinary: ${cloudinaryOn ? "on" : "off (uploads saved locally)"} | Razorpay: ${razorpayOn ? "on" : "off"}`);
});
