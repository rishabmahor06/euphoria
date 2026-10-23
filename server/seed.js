// Fill an empty database with the products/categories the storefront shipped with.
import { data, save, nextId } from "./db.js";
import { woomen } from "../src/Data/women.js";
import { men } from "../src/Data/men.js";
import { necklaces } from "../src/Data/necklace.js";

const GROUPS = {
  Lehengas: "women",
  Kurtas: "women",
  Menswear: "men",
  Necklaces: "jewellery",
  Earrings: "jewellery",
  Bangles: "jewellery",
  Rings: "jewellery",
};

export const seed = () => {
  if (data.categories.length || data.products.length) return;
  const all = [...woomen, ...men, ...necklaces];
  const catByName = {};
  for (const name of Object.keys(GROUPS)) {
    const sample = all.find((p) => p.category === name);
    const cat = {
      id: nextId("categories"),
      name,
      group: GROUPS[name],
      image: sample?.images?.[0] || "",
      createdAt: new Date().toISOString(),
    };
    data.categories.push(cat);
    catByName[name] = cat;
  }
  for (const p of all) {
    data.products.push({
      id: p.id,
      title: p.title,
      price: p.price,
      categoryId: catByName[p.category].id,
      description: p.description || "",
      images: p.images, // [0] = front, [1] = back, rest = extra
      stock: 25,
      status: "active",
      featured: false,
      createdAt: new Date().toISOString(),
    });
  }
  save();
  console.log(`Seeded ${data.categories.length} categories and ${data.products.length} products`);
};
