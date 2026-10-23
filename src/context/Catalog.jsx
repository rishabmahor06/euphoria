import { useEffect, useMemo, useState } from "react";
import { CatalogContext } from "./catalogContext";
import { API } from "../api";
import { woomen } from "../Data/women";
import { men } from "../Data/men";
import { necklaces } from "../Data/necklace";

// Used instantly on first paint and whenever the API is unreachable.
const fallback = [
  ...woomen.map((p) => ({ ...p, group: "women" })),
  ...men.map((p) => ({ ...p, group: "men" })),
  ...necklaces.map((p) => ({ ...p, group: "jewellery" })),
];

export const CatalogProvider = ({ children }) => {
  const [products, setProducts] = useState(fallback);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const get = (p) => fetch(API + p).then((r) => (r.ok ? r.json() : Promise.reject()));
    Promise.all([get("/api/products"), get("/api/categories"), get("/api/banners")])
      .then(([p, c, b]) => {
        if (cancelled) return;
        setProducts(p);
        setCategories(c);
        setBanners(b);
        setLive(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => {
    const by = (g) => products.filter((p) => p.group === g);
    return {
      live,
      products,
      categories,
      women: by("women"),
      men: by("men"),
      jewellery: by("jewellery"),
      find: (id) => products.find((p) => p.id === Number(id)),
      bannersFor: (section) => banners.filter((b) => b.section === section).map((b) => b.image),
    };
  }, [products, categories, banners, live]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};
