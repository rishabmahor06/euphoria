import React, { useEffect, useState } from "react";
import { NavLink, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiTrendingUp,
  FiPackage,
  FiTag,
  FiImage,
  FiShoppingBag,
  FiUsers,
  FiMenu,
  FiLogOut,
  FiExternalLink,
} from "react-icons/fi";
import logo from "../assets/Collage/euphoria-logo.png";
import { api, getRole, getToken, logout } from "../api";
import { toast } from "../toast";
import AdminLogin from "./AdminLogin";

const NAV = [
  { to: "/admin", label: "Sales Dashboard", icon: FiGrid, end: true },
  { to: "/admin/marketing", label: "Marketing", icon: FiTrendingUp },
  { to: "/admin/products", label: "Products", icon: FiPackage },
  { to: "/admin/categories", label: "Categories", icon: FiTag },
  { to: "/admin/banners", label: "Site Images", icon: FiImage },
  { to: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { to: "/admin/users", label: "Users", icon: FiUsers },
];

const TITLES = {
  "/admin": "Sales Dashboard",
  "/admin/marketing": "Marketing",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/banners": "Site Images",
  "/admin/orders": "Orders",
  "/admin/users": "Users",
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("checking"); // checking | login | ok
  const name = localStorage.getItem("loggedInUser") || "Admin";

  // /admin shows its own sign-in until an admin token is verified by the server
  useEffect(() => {
    if (!getToken() || getRole() !== "admin") {
      setStatus("login");
      return;
    }
    api("/auth/me", { auth: true })
      .then((r) => {
        if (r.user.role !== "admin") throw new Error("Admin access only");
        setStatus("ok");
      })
      .catch(() => {
        logout();
        setStatus("login");
      });
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  if (status === "checking") return null;
  if (status === "login") return <AdminLogin onSuccess={() => setStatus("ok")} />;

  const doLogout = () => {
    logout();
    toast.success("Logged out");
    setStatus("login");
    navigate("/admin");
  };

  const sidebar = (
    <nav className="flex h-full flex-col">
      <Link to="/" className="mb-6 block px-2">
        <img src={logo} alt="Euphoria" className="mx-auto h-14 w-auto" />
        <p className="mt-1 text-center text-[11px] tracking-[0.25em] text-gray-400">ADMIN PANEL</p>
      </Link>
      <ul className="space-y-1">
        {NAV.map(({ to, label, icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition " +
                (isActive ? "bg-[#1E381E] font-medium text-white shadow" : "text-gray-600 hover:bg-[#eef3ee]")
              }
            >
              {React.createElement(icon, { className: "text-lg" })}
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-auto space-y-1 pt-6">
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 hover:bg-[#eef3ee]">
          <FiExternalLink className="text-lg" /> View store
        </Link>
        <button
          onClick={doLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#c8452a] hover:bg-[#fbeeea]"
        >
          <FiLogOut className="text-lg" /> Log out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9EEDC] to-[#ecdcbb] p-3 sm:p-5">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1500px] gap-5 sm:min-h-[calc(100vh-2.5rem)]">
        {/* desktop sidebar */}
        <aside className="sticky top-5 hidden h-[calc(100vh-2.5rem)] w-60 shrink-0 rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-black/5 lg:block">
          {sidebar}
        </aside>

        {/* mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-[7000] lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-64 bg-white p-4 shadow-2xl">{sidebar}</div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <header className="mb-5 flex items-center justify-between gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <button onClick={() => setOpen(true)} className="text-2xl text-[#1E381E] lg:hidden" aria-label="Menu">
                <FiMenu />
              </button>
              <h1 className="text-xl font-semibold text-[#1E381E]">{TITLES[pathname.replace(/\/$/, "")] || "Admin"}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-gray-500 sm:block">Signed in as</span>
              <span className="flex items-center gap-2 rounded-full bg-[#eef3ee] py-1 pl-1 pr-3 text-sm font-medium text-[#1E381E]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1E381E] text-xs text-white">
                  {name.slice(0, 1).toUpperCase()}
                </span>
                {name}
              </span>
            </div>
          </header>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
