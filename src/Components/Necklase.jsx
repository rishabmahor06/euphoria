import React, { useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageHeader from "./PageHeader";
import ProductCard from "./ProductCard";
import { useCatalog } from "../context/catalogContext";

const GEMS = [
  "Emerald",
  "Ruby",
  "Pearl",
  "Tanzanite",
  "Sapphire",
  "Tourmaline",
  "Morganite",
  "Navratan",
  "Spinel",
];

const PRICE_RANGES = [
  { id: "p1", label: "Under ₹50,000", test: (p) => p < 50000 },
  { id: "p2", label: "₹50,000 - ₹1,50,000", test: (p) => p >= 50000 && p < 150000 },
  { id: "p3", label: "₹1,50,000 - ₹3,00,000", test: (p) => p >= 150000 && p < 300000 },
  { id: "p4", label: "₹3,00,000 - ₹6,00,000", test: (p) => p >= 300000 && p < 600000 },
  { id: "p5", label: "Above ₹6,00,000", test: (p) => p >= 600000 },
];

// Attributes derived from the title / description of each product
const enrich = (p) => {
  const text = `${p.title} ${p.description}`;
  const material = [];
  if (/gold|\d\s?kt/i.test(text)) material.push("Gold");
  if (/diamond/i.test(text)) material.push("Diamond");
  if (/polki/i.test(text)) material.push("Polki");
  if (/pearl/i.test(text)) material.push("Pearl");
  if (/gemstone|emerald|ruby|tanzanite|sapphire|tourmaline|morganite|navratan|spinel/i.test(text))
    material.push("Gemstone");
  const metal = [...new Set([...text.matchAll(/(\d{2})\s?kt/gi)].map((m) => `${m[1]} KT Gold`))];
  const gemstone = GEMS.filter((g) => new RegExp(g, "i").test(text));
  return { ...p, material, metal, gemstone };
};

const build = (necklaces) => {
  const items = necklaces.map(enrich);

  const countBy = (getVals) => {
    const map = new Map();
    items.forEach((p) => getVals(p).forEach((v) => map.set(v, (map.get(v) || 0) + 1)));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  };

  // First three sections are always visible; the rest sit behind "View more".
  const SECTIONS = [
    {
      key: "price",
      title: "Price",
      options: PRICE_RANGES.map((r) => [r.id, items.filter((p) => r.test(p.price)).length, r.label]).filter((o) => o[1] > 0),
      match: (p, sel) => PRICE_RANGES.some((r) => sel.includes(r.id) && r.test(p.price)),
    },
    {
      key: "type",
      title: "Product Type",
      options: countBy((p) => [p.category]).map(([v, n]) => [v, n, v]),
      match: (p, sel) => sel.includes(p.category),
    },
    {
      key: "material",
      title: "Material",
      options: countBy((p) => p.material).map(([v, n]) => [v, n, v]),
      match: (p, sel) => p.material.some((m) => sel.includes(m)),
    },
    {
      key: "metal",
      title: "Metal",
      extra: true,
      options: countBy((p) => p.metal).map(([v, n]) => [v, n, v]),
      match: (p, sel) => p.metal.some((m) => sel.includes(m)),
    },
    {
      key: "gemstone",
      title: "Gemstone",
      extra: true,
      options: countBy((p) => p.gemstone).map(([v, n]) => [v, n, v]),
      match: (p, sel) => p.gemstone.some((g) => sel.includes(g)),
    },
  ].filter((s) => s.options.length > 0);

  return { items, SECTIONS };
};

const FilterPanel = ({ sections: SECTIONS, sel, toggle, clear, total, expanded, setExpanded }) => (
  <div>
    <div className="flex items-center justify-between pb-3 border-b border-[#1E381E]/20">
      <p className="text-sm font-bold tracking-wide text-[#1E381E]">
        FILTERS
        {total > 0 && (
          <span className="ml-2 rounded bg-[#1E381E]/10 px-1.5 py-0.5 text-xs">{total}</span>
        )}
      </p>
      {total > 0 && (
        <button onClick={clear} className="text-xs font-bold text-red-600 hover:underline">
          CLEAR ALL
        </button>
      )}
    </div>

    {SECTIONS.filter((s) => expanded || !s.extra).map((s) => (
      <div key={s.key} className="py-4 border-b border-[#1E381E]/15">
        <h3 className="font-bold text-[#1E381E] mb-3">{s.title}</h3>
        <ul className="space-y-2">
          {s.options.map(([value, count, label]) => (
            <li key={value}>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={(sel[s.key] || []).includes(value)}
                  onChange={() => toggle(s.key, value)}
                  className="w-4 h-4 accent-[#1E381E]"
                />
                <span>{label}</span>
                <span className="text-gray-400 text-xs">({count})</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    ))}

    {SECTIONS.some((s) => s.extra) && (
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 flex items-center gap-1 text-sm font-bold text-[#1E381E] hover:underline"
      >
        {expanded ? "View less" : "View more filters"}
        <MdKeyboardArrowDown className={"text-lg transition-transform " + (expanded ? "rotate-180" : "")} />
      </button>
    )}
  </div>
);

const Necklase = () => {
  const { jewellery } = useCatalog();
  const { items, SECTIONS } = useMemo(() => build(jewellery), [jewellery]);
  const [sel, setSel] = useState({});
  const [sort, setSort] = useState("default");
  const [expanded, setExpanded] = useState(false);
  const [drawer, setDrawer] = useState(false);

  const toggle = (key, value) =>
    setSel((prev) => ({
      ...prev,
      [key]: (prev[key] || []).includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...(prev[key] || []), value],
    }));
  const clear = () => setSel({});
  const total = Object.values(sel).reduce((n, a) => n + a.length, 0);

  const list = useMemo(
    () =>
      items
        .filter((p) => SECTIONS.every((s) => !(sel[s.key] || []).length || s.match(p, sel[s.key])))
        .sort((a, b) =>
          sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : 0
        ),
    [items, SECTIONS, sel, sort]
  );

  const labelOf = (key, value) =>
    SECTIONS.find((s) => s.key === key)?.options.find((o) => o[0] === value)?.[2] ?? value;

  const panel = (
    <FilterPanel
      sections={SECTIONS}
      sel={sel}
      toggle={toggle}
      clear={clear}
      total={total}
      expanded={expanded}
      setExpanded={setExpanded}
    />
  );

  return (
    <div>
      <Navbar />
      <PageHeader
        title="Jewellery"
        subtitle="Polki, diamond and gold pieces to complete every look."
      />

      <div className="px-4 sm:px-8 lg:px-16 py-6 flex gap-8 items-start">
        {/* Left: filters. Scrolls on its own only after "View more" is opened. */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-[5.25rem]">
          <div
            className={
              "pr-3 " +
              (expanded
                ? "overflow-y-auto overscroll-contain [scrollbar-width:thin]"
                : "overflow-hidden")
            }
            style={{ maxHeight: "calc(100vh - 6.5rem)" }}
          >
            {panel}
          </div>
        </aside>

        {/* Right: products (scrolls with the page) */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <button
              onClick={() => setDrawer(true)}
              className="lg:hidden rounded-full border border-[#1E381E] px-4 py-1.5 text-sm font-bold text-[#1E381E]"
            >
              Filters{total > 0 ? ` (${total})` : ""}
            </button>

            {Object.entries(sel).flatMap(([key, vals]) =>
              vals.map((v) => (
                <button
                  key={key + v}
                  onClick={() => toggle(key, v)}
                  className="flex items-center gap-1 rounded-full border border-[#1E381E]/60 bg-white px-3 py-1.5 text-sm"
                >
                  {labelOf(key, v)} <IoClose />
                </button>
              ))
            )}

            <div className="ml-auto flex items-center gap-3">
              <span className="text-gray-600 text-sm whitespace-nowrap">{list.length} Results</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-300 rounded-full px-4 py-2 bg-white text-sm"
              >
                <option value="default">Sort By: Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {list.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-[#1E381E]">No jewellery matches your filters</p>
              <button
                onClick={clear}
                className="mt-4 px-6 py-2 border border-green-900 text-green-900 font-bold hover:bg-green-900 hover:text-white transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
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
      </div>

      {/* Mobile filter drawer */}
      {drawer && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
          <div className="relative ml-auto w-[85%] max-w-sm h-full bg-[#F9EEDC] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-bold text-[#1E381E]">Filters</span>
              <button onClick={() => setDrawer(false)} aria-label="Close filters" className="text-2xl">
                <IoClose />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">{panel}</div>
            <div className="p-4 border-t">
              <button
                onClick={() => setDrawer(false)}
                className="w-full bg-[#264726] text-white py-3 font-bold rounded-md"
              >
                Show {list.length} results
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Necklase;
