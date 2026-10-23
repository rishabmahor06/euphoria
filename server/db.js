// Tiny JSON-file database (no native deps). Collections live in server/data/db.json
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(path.dirname(fileURLToPath(import.meta.url)), "data");
const FILE = path.join(dir, "db.json");

const empty = () => ({
  users: [],
  categories: [],
  products: [],
  orders: [],
  banners: [],
  subscribers: [],
  counters: {},
});

fs.mkdirSync(dir, { recursive: true });
export const data = fs.existsSync(FILE)
  ? { ...empty(), ...JSON.parse(fs.readFileSync(FILE, "utf8")) }
  : empty();

let timer = null;
export const save = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const tmp = FILE + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, FILE);
  }, 50);
};

// next numeric id for a collection (optionally starting above `min`)
export const nextId = (name, min = 0) => {
  const maxExisting = data[name].reduce((m, x) => Math.max(m, Number(x.id) || 0), min);
  const counter = Math.max(data.counters[name] || 0, maxExisting) + 1;
  data.counters[name] = counter;
  return counter;
};
