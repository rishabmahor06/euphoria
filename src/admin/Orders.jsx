import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { api } from "../api";
import { toast } from "../toast";
import { Card, Badge, Spinner, ErrorBox, inputCls, useApi, inr, dateTime } from "./ui";

const STATUSES = ["processing", "shipped", "delivered", "cancelled"];
const TONE = { processing: "blue", shipped: "amber", delivered: "green", cancelled: "rose", pending: "gray" };

const Orders = () => {
  const { data, error, reload } = useApi("/api/admin/orders");
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);

  if (error) return <ErrorBox message={error} onRetry={reload} />;
  if (!data) return <Spinner />;

  const rows = data.filter((o) => {
    if (filter === "all") return true;
    if (filter === "unpaid") return o.payment.status !== "paid";
    return o.payment.status === "paid" && o.status === filter;
  });

  const setStatus = async (o, status) => {
    try {
      await api(`/api/admin/orders/${o.id}`, { method: "PATCH", auth: true, body: { status } });
      toast.success(`${o.orderNo} marked ${status}`);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const tabs = ["all", ...STATUSES, "unpaid"];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={
              "rounded-full border px-4 py-1.5 text-sm capitalize transition " +
              (filter === t
                ? "border-[#1E381E] bg-[#1E381E] text-white"
                : "border-gray-300 bg-white text-[#1E381E] hover:border-[#1E381E]")
            }
          >
            {t}
          </button>
        ))}
      </div>

      <Card title={`${rows.length} orders`}>
        {rows.length === 0 ? (
          <p className="py-10 text-center text-gray-400">No orders here yet</p>
        ) : (
          <div className="divide-y">
            {rows.map((o) => {
              const paid = o.payment.status === "paid";
              const isOpen = open === o.id;
              return (
                <div key={o.id} className="py-3">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <button onClick={() => setOpen(isOpen ? null : o.id)} className="flex items-center gap-2 font-semibold text-[#1E381E]">
                      <FiChevronDown className={"transition " + (isOpen ? "rotate-180" : "")} />
                      {o.orderNo}
                    </button>
                    <div className="min-w-[8rem] flex-1">
                      <p className="text-sm font-medium">{o.customer.name}</p>
                      <p className="text-xs text-gray-400">{dateTime(o.createdAt)}</p>
                    </div>
                    <p className="text-sm text-gray-500">{o.items.reduce((n, l) => n + l.qty, 0)} items</p>
                    <p className="font-semibold">{inr(o.total)}</p>
                    <Badge tone={paid ? "green" : o.payment.status === "failed" ? "rose" : "gray"}>
                      {paid ? "paid" : o.payment.status}
                    </Badge>
                    {paid ? (
                      <select
                        value={o.status}
                        onChange={(e) => setStatus(o, e.target.value)}
                        className={inputCls + " !w-auto !py-1 capitalize"}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Badge tone={TONE[o.status]}>{o.status}</Badge>
                    )}
                  </div>

                  {isOpen && (
                    <div className="mt-3 grid gap-4 rounded-xl bg-[#f7faf7] p-4 lg:grid-cols-3">
                      <ul className="space-y-2 lg:col-span-2">
                        {o.items.map((l) => (
                          <li key={l.productId} className="flex items-center gap-3 text-sm">
                            <img src={l.image} alt="" className="h-14 w-11 rounded-md object-cover" />
                            <span className="flex-1">{l.title}</span>
                            <span className="text-gray-500">
                              {inr(l.price)} × {l.qty}
                            </span>
                            <span className="w-24 text-right font-medium">{inr(l.price * l.qty)}</span>
                          </li>
                        ))}
                        <li className="space-y-1 border-t pt-2 text-right text-sm">
                          <p className="text-gray-500">Subtotal {inr(o.subtotal)}</p>
                          {o.discount > 0 && (
                            <p className="text-green-700">
                              Coupon {o.coupon}: -{inr(o.discount)}
                            </p>
                          )}
                          <p className="font-bold text-[#1E381E]">Total {inr(o.total)}</p>
                        </li>
                      </ul>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-semibold text-[#1E381E]">Customer</p>
                          <p>{o.customer.name}</p>
                          <p className="text-gray-500">{o.customer.email}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#1E381E]">Deliver to</p>
                          <p>{o.shipping.name}</p>
                          <p className="text-gray-500">{o.shipping.phone}</p>
                          <p className="text-gray-500">
                            {o.shipping.address}, {o.shipping.city} {o.shipping.pincode}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#1E381E]">Payment</p>
                          <p className="break-all text-gray-500">Razorpay order: {o.payment.razorpayOrderId}</p>
                          <p className="break-all text-gray-500">Payment ID: {o.payment.paymentId || "—"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Orders;
