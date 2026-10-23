import React, { useMemo, useState } from "react";
import { FiSearch, FiSlash, FiCheckCircle, FiTrash2, FiShield } from "react-icons/fi";
import { api } from "../api";
import { toast } from "../toast";
import { Card, Stat, Badge, Spinner, ErrorBox, inputCls, useApi, inr, dateOnly, dateTime } from "./ui";

const Users = () => {
  const { data, error, reload } = useApi("/api/admin/users");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (data || []).filter((u) => u.name.toLowerCase().includes(t) || u.email.includes(t));
  }, [data, q]);

  if (error) return <ErrorBox message={error} onRetry={reload} />;
  if (!data) return <Spinner />;

  const act = async (u, body, msg) => {
    try {
      await api(`/api/admin/users/${u.id}`, { method: "PATCH", auth: true, body });
      toast.success(msg);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };
  const remove = async (u) => {
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/users/${u.id}`, { method: "DELETE", auth: true });
      toast.success("User deleted");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const customers = data.filter((u) => u.role === "user");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Registered users" value={customers.length} icon={FiCheckCircle} />
        <Stat label="Admins" value={data.length - customers.length} icon={FiShield} tone="blue" />
        <Stat label="Blocked" value={data.filter((u) => u.blocked).length} icon={FiSlash} tone="rose" />
        <Stat label="Total logins" value={data.reduce((n, u) => n + u.loginCount, 0)} tone="amber" />
      </div>

      <Card>
        <div className="relative mb-4 max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email" className={inputCls + " pl-9"} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="py-2 font-medium">User</th>
                <th className="py-2 font-medium">Role</th>
                <th className="py-2 font-medium">Joined</th>
                <th className="py-2 font-medium">Logins</th>
                <th className="py-2 font-medium">Orders</th>
                <th className="py-2 font-medium">Spent</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((u) => (
                <tr key={u.id}>
                  <td className="py-2.5">
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="py-2.5">
                    <Badge tone={u.role === "admin" ? "blue" : "gray"}>{u.role}</Badge>
                  </td>
                  <td className="py-2.5 text-gray-500">{dateOnly(u.createdAt)}</td>
                  <td className="py-2.5" title={`Last login: ${dateTime(u.lastLogin)}`}>
                    {u.loginCount}
                  </td>
                  <td className="py-2.5">{u.orders}</td>
                  <td className="py-2.5 font-medium">{inr(u.spent)}</td>
                  <td className="py-2.5">
                    <Badge tone={u.blocked ? "rose" : "green"}>{u.blocked ? "blocked" : "active"}</Badge>
                  </td>
                  <td className="py-2.5">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => act(u, { blocked: !u.blocked }, u.blocked ? "User unblocked" : "User blocked")}
                        className="rounded-lg px-2 py-1.5 text-xs text-gray-600 hover:bg-[#eef3ee]"
                      >
                        {u.blocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        onClick={() => act(u, { role: u.role === "admin" ? "user" : "admin" }, "Role updated")}
                        className="rounded-lg px-2 py-1.5 text-xs text-gray-600 hover:bg-[#eef3ee]"
                      >
                        {u.role === "admin" ? "Remove admin" : "Make admin"}
                      </button>
                      <button onClick={() => remove(u)} aria-label="Delete" className="rounded-lg p-2 text-[#c8452a] hover:bg-[#fbeeea]">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="py-10 text-center text-gray-400">No users found</p>}
        </div>
      </Card>
    </div>
  );
};

export default Users;
