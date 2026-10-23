import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { api, getToken } from "../api";

const Orders = () => {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) return setError("Please log in to see your orders.");
    api("/api/orders/mine", { auth: true })
      .then((r) => setOrders(Array.isArray(r) ? r : []))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="px-4 md:px-12 xl:px-24 py-8 md:py-14 min-h-[70vh]">
        <h1 className="text-3xl md:text-4xl text-[#1E381E] mb-6">My Orders</h1>
        {error && <p className="text-gray-600">{error}</p>}
        {orders && orders.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-[#1E381E]">No orders yet</p>
            <Link to="/shop" className="inline-block mt-4 px-8 py-3 bg-[#264726] text-white font-bold rounded-md">
              START SHOPPING
            </Link>
          </div>
        )}
        <div className="space-y-4">
          {(orders || []).map((o) => (
            <div key={o.id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <div>
                  <p className="font-bold text-[#1E381E]">{o.orderNo}</p>
                  <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <span className="rounded-full bg-[#eaf6ea] px-3 py-1 text-sm capitalize text-[#2e7d3b]">{o.status}</span>
                <p className="text-xl font-bold">₹{o.total.toLocaleString("en-IN")}</p>
              </div>
              <ul className="mt-3 space-y-2">
                {o.items.map((l) => (
                  <li key={l.productId} className="flex items-center gap-3">
                    <img src={l.image} alt="" className="h-14 w-12 rounded object-cover" />
                    <span className="flex-1">{l.title}</span>
                    <span className="text-gray-500">x{l.qty}</span>
                    <span>₹{(l.price * l.qty).toLocaleString("en-IN")}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
