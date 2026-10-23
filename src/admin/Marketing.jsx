import React from "react";
import { FiUserPlus, FiLogIn, FiMail, FiPercent, FiTag, FiRepeat } from "react-icons/fi";
import { Card, Stat, Spinner, ErrorBox, useApi, inr, dateTime } from "./ui";
import { MiniBars, AreaChart } from "./charts";

const Marketing = () => {
  const stats = useApi("/api/admin/stats?days=30");
  const subs = useApi("/api/admin/subscribers");

  if (stats.error) return <ErrorBox message={stats.error} onRetry={stats.reload} />;
  if (!stats.data) return <Spinner />;
  const { users, marketing, sales } = stats.data;

  return (
    <div className="space-y-5">
      <p className="text-gray-500">Audience growth and promotion results (last 30 days)</p>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Registered users" value={users.total} hint={`${users.new30} joined in 30 days`} icon={FiUserPlus} />
        <Stat label="Total logins" value={users.totalLogins} icon={FiLogIn} tone="blue" />
        <Stat label="Newsletter subscribers" value={marketing.subscribers} icon={FiMail} tone="amber" />
        <Stat label="Buyer conversion" value={marketing.conversion + "%"} hint="Users who purchased" icon={FiPercent} tone="rose" />
        <Stat label="Coupon orders" value={marketing.couponOrders} icon={FiTag} />
        <Stat label="Discount given" value={inr(marketing.discountGiven)} hint="Via ROYAL15" icon={FiTag} tone="blue" />
        <Stat label="Repeat customers" value={marketing.repeatCustomers} icon={FiRepeat} tone="amber" />
        <Stat label="New this week" value={users.new7} icon={FiUserPlus} tone="rose" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="New signups per day">
          <AreaChart data={users.signupsByDay} color="#2f6fd6" />
        </Card>
        <Card title="Logins per day">
          <AreaChart data={users.loginsByDay} color="#c27a14" />
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Newsletter signups per day">
          <MiniBars data={marketing.subscribersByDay} color="#4caf62" />
        </Card>
        <Card title="Orders per day" className="lg:col-span-2">
          <MiniBars
            data={sales.revenueByDay.map((d) => ({ date: d.date, value: d.orders }))}
            color="#1E381E"
          />
        </Card>
      </div>

      <Card title="Newsletter subscribers" action={<span className="text-sm text-gray-400">{subs.data?.length || 0} total</span>}>
        {!subs.data ? (
          <Spinner />
        ) : subs.data.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            Nobody has subscribed yet. The footer email box on the store feeds this list.
          </p>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white text-gray-400">
                <tr>
                  <th className="py-2 font-medium">Email</th>
                  <th className="py-2 font-medium">Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subs.data.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2">{s.email}</td>
                    <td className="py-2 text-gray-500">{dateTime(s.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Marketing;
