import React, { useState } from "react";
import { FiDollarSign, FiShoppingBag, FiTrendingUp, FiBox, FiUsers, FiAlertTriangle } from "react-icons/fi";
import { Card, Stat, Spinner, ErrorBox, useApi, inr, Badge } from "./ui";
import { AreaChart, HBars } from "./charts";

const STATUS_TONE = {
  processing: "blue",
  shipped: "amber",
  delivered: "green",
  cancelled: "rose",
  failed: "rose",
  unpaid: "gray",
};

const Dashboard = () => {
  const [days, setDays] = useState(30);
  const { data, loading, error, reload } = useApi(`/api/admin/stats?days=${days}`);

  if (error) return <ErrorBox message={error} onRetry={reload} />;
  if (!data) return <Spinner />;
  const { sales, users, catalog } = data;
  const periodRevenue = sales.revenueByDay.reduce((n, d) => n + d.revenue, 0);

  return (
    <div className={"space-y-5 transition-opacity " + (loading ? "opacity-60" : "")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-gray-500">Overview of your store sales</p>
        <div className="flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-black/5">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={
                "rounded-lg px-4 py-1.5 text-sm transition " +
                (days === d ? "bg-[#1E381E] text-white" : "text-gray-600 hover:bg-[#eef3ee]")
              }
            >
              {d} days
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Total revenue" value={inr(sales.revenue)} hint="All paid orders" icon={FiDollarSign} />
        <Stat label="Paid orders" value={sales.orders} hint={`${sales.itemsSold} items sold`} icon={FiShoppingBag} tone="blue" />
        <Stat label="Average order" value={inr(sales.avgOrder)} icon={FiTrendingUp} tone="amber" />
        <Stat label="Customers" value={users.total} hint={`${users.new7} new this week`} icon={FiUsers} tone="rose" />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card
          title={`Revenue · last ${days} days`}
          action={<span className="text-sm font-semibold text-[#1E381E]">{inr(periodRevenue)}</span>}
          className="xl:col-span-2"
        >
          <AreaChart data={sales.revenueByDay} valueKey="revenue" format={inr} />
        </Card>
        <Card title="Order status">
          {Object.keys(sales.statusCount).length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No orders yet</p>
          ) : (
            <ul className="space-y-3">
              {Object.entries(sales.statusCount).map(([k, v]) => (
                <li key={k} className="flex items-center justify-between">
                  <Badge tone={STATUS_TONE[k] || "gray"}>{k}</Badge>
                  <span className="font-semibold text-[#1E381E]">{v}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Top selling products">
          {sales.topProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No sales yet</p>
          ) : (
            <ul className="divide-y">
              {sales.topProducts.map((p) => (
                <li key={p.title} className="flex items-center gap-3 py-2.5">
                  <img src={p.image} alt="" className="h-12 w-10 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.qty} sold</p>
                  </div>
                  <p className="text-sm font-semibold text-[#1E381E]">{inr(p.revenue)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Sales by category">
          <HBars items={sales.byCategory} format={inr} />
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Products" value={catalog.products} hint={`${catalog.active} live`} icon={FiBox} />
        <Stat label="Categories" value={catalog.categories} icon={FiBox} tone="blue" />
        <Stat label="Low stock (≤5)" value={catalog.lowStock} icon={FiAlertTriangle} tone="amber" />
        <Stat label="Blocked users" value={users.blocked} icon={FiUsers} tone="rose" />
      </div>
    </div>
  );
};

export default Dashboard;
