import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProductCard from "./ProductCard";
import { useCatalog } from "../context/catalogContext";

const priceRanges = [
  { id: "all", label: "All prices", test: () => true },
  { id: "u1", label: "Under ₹1,00,000", test: (p) => p < 100000 },
  { id: "m", label: "₹1,00,000 - ₹2,00,000", test: (p) => p >= 100000 && p <= 200000 },
  { id: "o2", label: "Above ₹2,00,000", test: (p) => p > 200000 },
];


const Shop = () => {
  const { products } = useCatalog();
  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category))], [products]);
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const urlQuery = params.get("q") || "";
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);
  const [category, setCategory] = useState("All");
  const [range, setRange] = useState("all");
  const [sort, setSort] = useState("default");

  const list = useMemo(() => {
    const test = priceRanges.find((r) => r.id === range).test;
    return products
      .filter((p) => category === "All" || p.category === category)
      .filter((p) => test(p.price))
      .filter((p) => p.title.toLowerCase().includes(query.trim().toLowerCase()))
      .sort((a, b) =>
        sort === "low"
          ? a.price - b.price
          : sort === "high"
          ? b.price - a.price
          : 0
      );
  }, [products, query, category, range, sort]);

  const filtered = query || category !== "All" || range !== "all";
  const reset = () => {
    setQuery("");
    setCategory("All");
    setRange("all");
    setSort("default");
  };

  return (
    <div>
      <Navbar />

      <div className="relative h-44 sm:h-64 overflow-hidden">
        <img
          src={products[0]?.second}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-3xl sm:text-5xl tracking-wide">Shop</h1>
          <p className="mt-2 text-sm sm:text-lg text-gray-200 max-w-xl">
            Lehengas, kurtas and fine jewellery, handcrafted for every celebration.
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-8 lg:px-16 pt-4 text-sm text-gray-600">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span className="text-[#1E381E] font-semibold">Shop</span>
      </div>

      <div className="sticky top-[4.25rem] z-20 bg-[#F9EEDC]/95 backdrop-blur px-4 sm:px-8 lg:px-16 py-4 mt-2 border-b border-[#1E381E]/10">
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 [scrollbar-width:none]">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={
                "whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors " +
                (category === c
                  ? "bg-[#1E381E] border-[#1E381E] text-white"
                  : "bg-white border-gray-300 text-[#1E381E] hover:border-[#1E381E]")
              }
            >
              {c}
              <span className="ml-1.5 opacity-70">
                {c === "All"
                  ? products.length
                  : products.filter((p) => p.category === c).length}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:flex lg:flex-row gap-2 sm:gap-3 lg:items-center">
          <div className="relative col-span-2 lg:flex-1 lg:max-w-sm">
            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#1E381E]"
            />
          </div>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 bg-white focus:outline-none"
          >
            {priceRanges.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 bg-white focus:outline-none"
          >
            <option value="default">Sort: Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
          <div className="col-span-2 flex items-center justify-between lg:ml-auto gap-4">
            <span className="text-gray-600 text-sm">
              Showing <b>{list.length}</b> of {products.length} products
            </span>
            {filtered && (
              <button
                onClick={reset}
                className="flex items-center gap-1 text-sm text-red-600 hover:underline"
              >
                <IoClose /> Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 lg:px-16 py-8 min-h-[40vh]">
        {list.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-[#1E381E]">No products match your filters</p>
            <button
              onClick={reset}
              className="mt-4 px-6 py-2 border border-green-900 text-green-900 font-bold hover:bg-green-900 hover:text-white transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {list.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                badge={p.category}
                to={`/productdetails/${p.title.replace(/\s+/g, "-")}/${p.id}`}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Shop;
