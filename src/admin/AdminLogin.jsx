import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import logo from "../assets/Collage/euphoria-logo.png";
import { API } from "../api";
import { toast } from "../toast";

// Separate sign-in for /admin. Only accounts with the admin role get through.
const AdminLogin = ({ onSuccess }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!id.trim() || !password) return toast.warning("Enter your admin ID and password");
    setBusy(true);
    try {
      const res = await fetch(API + "/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: id.trim(), password }),
      });
      const r = await res.json();
      if (!r.success) throw new Error(r.message || "Login failed");
      if (r.role !== "admin") throw new Error("This account is not an admin");
      localStorage.setItem("token", r.jwtToken);
      localStorage.setItem("loggedInUser", r.name);
      localStorage.setItem("role", "admin");
      toast.success(`Welcome, ${r.name}`);
      onSuccess();
    } catch (err) {
      toast.error(
        err.message === "Failed to fetch"
          ? "API server is not running. Start it with: npm run server"
          : err.message
      );
    } finally {
      setBusy(false);
    }
  };

  const field =
    "flex items-center gap-3 rounded-xl border-2 border-[#cfe0cf] bg-white px-4 transition focus-within:border-[#1E381E]";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F9EEDC] to-[#ecdcbb] p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl auth-card-in">
        <Link to="/" className="block">
          <img src={logo} alt="Euphoria" className="mx-auto h-14 w-auto" />
        </Link>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm tracking-[0.2em] text-gray-500">
          <FiShield /> ADMIN PANEL
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-[#111]">Sign in</h1>
        <p className="mb-5 text-sm text-gray-500">Use your admin ID and password to continue.</p>

        <label className="mb-1 block text-sm font-medium text-gray-600">Admin ID</label>
        <div className={field + " mb-4"}>
          <FiUser className="text-gray-400" />
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="admin@euphoria.com"
            autoComplete="username"
            autoFocus
            className="w-full bg-transparent py-2.5 outline-none placeholder-gray-300"
          />
        </div>

        <label className="mb-1 block text-sm font-medium text-gray-600">Password</label>
        <div className={field + " mb-6"}>
          <FiLock className="text-gray-400" />
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            className="w-full bg-transparent py-2.5 outline-none placeholder-gray-300"
          />
          <button type="button" onClick={() => setShow(!show)} aria-label="Show password" className="text-gray-400 hover:text-[#1E381E]">
            {show ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-[#111] py-3 font-medium text-white transition hover:bg-[#1E381E] disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <Link to="/" className="mt-4 block text-center text-sm text-gray-500 hover:underline">
          Back to store
        </Link>
      </form>
    </div>
  );
};

export default AdminLogin;
