import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { CartContext } from "../context/Cart";
import { api } from "../api";
import { toast } from "../toast";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const input =
  "w-full rounded-lg border-2 border-[#cfe0cf] bg-white px-3 py-2 outline-none focus:border-[#1E381E]";

// Delivery details -> create order on the server -> Razorpay popup -> verify.
const Checkout = ({ open, onClose, coupon, total }) => {
  const cart = useContext(CartContext);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({
    name: localStorage.getItem("loggedInUser") || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  if (!open) return null;

  const set = (e) => setF((p) => ({ ...p, [e.target.name]: e.target.value }));

  const pay = async (e) => {
    e.preventDefault();
    if (!f.name || !f.phone || !f.address || !f.pincode) {
      return toast.warning("Please fill in your delivery details");
    }
    setBusy(true);
    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Could not load Razorpay. Check your internet connection.");
      const o = await api("/api/orders/create", {
        method: "POST",
        auth: true,
        body: {
          items: cart.item.map((p) => ({ id: p.id, qty: p.qty })),
          couponCode: coupon,
          shipping: f,
        },
      });
      const rzp = new window.Razorpay({
        key: o.key,
        amount: o.amount,
        currency: o.currency,
        name: "Euphoria",
        description: `Order ${o.orderNo}`,
        order_id: o.razorpayOrderId,
        prefill: { name: f.name, contact: f.phone },
        theme: { color: "#1E381E" },
        handler: async (r) => {
          try {
            await api("/api/orders/verify", {
              method: "POST",
              auth: true,
              body: { orderId: o.orderId, ...r },
            });
            cart.clearCart();
            toast.success(`Payment successful! Order ${o.orderNo} placed`);
            onClose();
            navigate("/orders");
          } catch (err) {
            toast.error(err.message);
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.on("payment.failed", (r) => toast.error(r.error?.description || "Payment failed"));
      rzp.open();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form
        onSubmit={pay}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-2xl text-gray-500">
          <IoClose />
        </button>
        <h2 className="text-2xl font-bold text-[#1E381E]">Delivery details</h2>
        <p className="mb-4 text-sm text-gray-500">Where should we send your order?</p>
        <div className="space-y-3">
          <input className={input} name="name" value={f.name} onChange={set} placeholder="Full name" />
          <input className={input} name="phone" value={f.phone} onChange={set} placeholder="Phone number" inputMode="tel" />
          <textarea className={input} name="address" value={f.address} onChange={set} placeholder="Address" rows={2} />
          <div className="flex gap-3">
            <input className={input} name="city" value={f.city} onChange={set} placeholder="City" />
            <input className={input} name="pincode" value={f.pincode} onChange={set} placeholder="Pincode" inputMode="numeric" />
          </div>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-lg bg-[#1E381E] py-3 font-bold text-white hover:bg-[#264726] disabled:opacity-60"
        >
          {busy ? "Please wait..." : `Pay ₹${Math.round(total).toLocaleString("en-IN")}`}
        </button>
        <p className="mt-2 text-center text-xs text-gray-500">Secure payment by Razorpay</p>
      </form>
    </div>
  );
};

export default Checkout;
