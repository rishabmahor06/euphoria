import logo from "../assets/Collage/euphoria-logo.png";
import { CiSearch, CiHeart, CiShoppingCart } from "react-icons/ci";
import { BiUser } from "react-icons/bi";
import { HiMenu, HiX } from "react-icons/hi";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useCatalog } from "../context/catalogContext";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CartContext } from "../context/Cart";
import { getRole, getToken, logout } from "../api";
import { toast } from "../toast";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/shop", label: "Shop" },
  { to: "/necklase", label: "Jewellery" },
  { to: "/women", label: "Women" },
];

const Navbar = () => {
  const cart = useContext(CartContext);
  const { products: catalog } = useCatalog();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const token = getToken();
  const role = getRole();
  const userName = localStorage.getItem("loggedInUser") || "Account";
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const inputRef = useRef(null);
  const boxRef = useRef(null);

  const term = q.trim().toLowerCase();
  const results = useMemo(
    () =>
      term
        ? catalog.filter((p) =>
            `${p.title} ${p.category}`.toLowerCase().includes(term)
          )
        : [],
    [term, catalog]
  );

  const closeSearch = () => {
    setSearchOpen(false);
    setQ("");
  };

  // close on route change, Escape, or click outside
  useEffect(() => {
    setSearchOpen(false);
    setQ("");
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!accountOpen) return;
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [accountOpen]);

  const doLogout = () => {
    logout();
    setAccountOpen(false);
    toast.success("Logged out");
    navigate("/");
  };

  useEffect(() => {
    if (!searchOpen) return;
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && closeSearch();
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) closeSearch();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [searchOpen]);

  const submitSearch = (e) => {
    e.preventDefault();
    if (!term) return;
    navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  // thin underline that grows on hover and stays under the active page
  const linkClass = ({ isActive }) =>
    "relative py-1 transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-[#1E381E] after:transition-all after:duration-300 " +
    (isActive
      ? "text-[#1E381E] font-semibold after:w-full"
      : "text-gray-700 hover:text-[#1E381E] after:w-0 hover:after:w-full");

  return (
    <div className="sticky top-0 z-40">
      <div className="bg-[#183818] text-white text-center text-xs sm:text-sm py-1 px-2 tracking-wide">
        <h1>
          Use Code:{" "}
          <Link to="" className="underline">
            royal15
          </Link>{" "}
          for Extra Discount
        </h1>
      </div>
      <div className="flex items-center justify-between bg-white/95 backdrop-blur shadow-[0_2px_12px_-4px_rgba(0,0,0,0.15)] px-4 sm:px-7 py-1">
        <button
          className="md:hidden text-2xl text-black"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>

        <Link to="/" className="shrink-0">
          <img src={logo} alt="Euphoria" className="h-8 sm:h-10 w-auto" />
        </Link>

        <ul className="hidden md:flex gap-6 lg:gap-9 text-[15px] lg:text-base tracking-wide">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <ul className="flex gap-1 sm:gap-2 text-black items-center">
          <li>
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="block"
            >
              <CiSearch className="h-5 w-5 p-1.5 box-content rounded-full text-black transition hover:bg-[#f3e6cc]" />
            </button>
          </li>
          <li className="relative" ref={accountRef}>
            {token ? (
              <button onClick={() => setAccountOpen((v) => !v)} aria-label="Account" className="block">
                <BiUser className="h-5 w-5 p-1.5 box-content rounded-full text-black transition hover:bg-[#f3e6cc]" />
              </button>
            ) : (
              <Link to="/login">
                <BiUser className="h-5 w-5 p-1.5 box-content rounded-full text-black transition hover:bg-[#f3e6cc]" />
              </Link>
            )}
            {accountOpen && (
              <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-xl bg-white text-base shadow-xl ring-1 ring-black/5">
                <p className="truncate border-b px-4 py-3 text-sm font-semibold text-[#1E381E]">Hi, {userName}</p>
                <Link to="/orders" className="block px-4 py-2.5 hover:bg-[#F9EEDC]">
                  My Orders
                </Link>
                {role === "admin" && (
                  <Link to="/admin" className="block px-4 py-2.5 hover:bg-[#F9EEDC]">
                    Admin Panel
                  </Link>
                )}
                <button onClick={doLogout} className="block w-full px-4 py-2.5 text-left text-[#c8452a] hover:bg-[#fbeeea]">
                  Log out
                </button>
              </div>
            )}
          </li>
          <li>
            <Link to="/wishlist">
              <CiHeart className="h-5 w-5 p-1.5 box-content rounded-full text-black transition hover:bg-[#f3e6cc]" />
            </Link>
          </li>
          <li>
            <Link to="/cart" className="relative block">
              <CiShoppingCart className="h-5 w-5 p-1.5 box-content rounded-full text-black transition hover:bg-[#f3e6cc]" />
              <span className="absolute top-0 right-0 min-w-[1rem] px-1 text-center bg-yellow-400 text-[10px] leading-4 font-bold rounded-full">
                {cart.cartCount}
              </span>
            </Link>
          </li>
        </ul>
      </div>

      {searchOpen && (
        <div
          ref={boxRef}
          className="absolute z-50 left-0 right-0 top-full bg-white shadow-2xl border-t px-4 sm:px-8 lg:px-16 py-4"
        >
          <form onSubmit={submitSearch} className="flex items-center gap-3 border-b-2 border-[#1E381E] pb-2">
            <CiSearch className="h-6 w-6 shrink-0" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for lehengas, kurtas, necklaces..."
              className="flex-1 min-w-0 text-lg outline-none bg-transparent"
            />
            <button type="button" onClick={closeSearch} aria-label="Close search" className="text-2xl">
              <HiX />
            </button>
          </form>

          {term && (
            <div className="mt-3 max-h-[60vh] overflow-y-auto">
              {results.length === 0 ? (
                <p className="py-6 text-center text-gray-500">
                  No results for &ldquo;{q.trim()}&rdquo;
                </p>
              ) : (
                <>
                  <ul>
                    {results.slice(0, 6).map((p) => (
                      <li key={p.id}>
                        <Link
                          to={`/productdetails/${p.title.replace(/\s+/g, "-")}/${p.id}`}
                          className="flex items-center gap-4 rounded-lg p-2 hover:bg-[#F9EEDC]"
                        >
                          <img src={p.first} alt="" className="h-16 w-14 rounded-md object-cover shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{p.title}</p>
                            <p className="text-sm text-gray-500">{p.category}</p>
                          </div>
                          <p className="ml-auto font-bold text-green-900 whitespace-nowrap">
                            ₹ {p.price.toLocaleString("en-IN")}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/shop?q=${encodeURIComponent(q.trim())}`}
                    className="block mt-2 py-3 text-center font-bold text-[#1E381E] hover:underline"
                  >
                    View all {results.length} results
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {open && (
        <ul className="md:hidden absolute z-50 left-0 right-0 bg-white shadow-lg flex flex-col text-lg border-t">
          {links.map((l) => (
            <li key={l.to} className="border-b last:border-b-0">
              <NavLink
                to={l.to}
                className={(s) => "block px-6 py-3 " + linkClass(s)}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Navbar;
