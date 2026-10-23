import React, { useMemo, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { api } from "../api";
import { toast } from "../toast";
import { Card, Badge, Btn, Field, ImageInput, Modal, Spinner, ErrorBox, inputCls, useApi, inr } from "./ui";

const blank = (categoryId = "") => ({
  title: "",
  price: "",
  categoryId,
  stock: 20,
  status: "active",
  featured: false,
  description: "",
  front: "",
  back: "",
  extra: ["", "", ""],
});

const toForm = (p) => ({
  title: p.title,
  price: p.price,
  categoryId: p.categoryId,
  stock: p.stock,
  status: p.status,
  featured: p.featured,
  description: p.description || "",
  front: p.images[0] || "",
  back: p.images[1] || "",
  extra: [p.images[2] || "", p.images[3] || "", p.images[4] || ""],
});

const Products = () => {
  const prods = useApi("/api/admin/products");
  const cats = useApi("/api/admin/categories");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [editing, setEditing] = useState(null); // null | "new" | product
  const [form, setForm] = useState(blank());
  const [saving, setSaving] = useState(false);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (prods.data || []).filter(
      (p) => (cat === "all" || String(p.categoryId) === cat) && p.title.toLowerCase().includes(t)
    );
  }, [prods.data, q, cat]);

  if (prods.error) return <ErrorBox message={prods.error} onRetry={prods.reload} />;
  if (!prods.data || !cats.data) return <Spinner />;

  const openNew = () => {
    setForm(blank(cats.data[0]?.id || ""));
    setEditing("new");
  };
  const openEdit = (p) => {
    setForm(toForm(p));
    setEditing(p);
  };
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    if (!form.front) return toast.warning("Upload the front image");
    if (!form.back) return toast.warning("Upload the back image");
    const body = {
      title: form.title,
      price: Number(form.price),
      categoryId: Number(form.categoryId),
      stock: Number(form.stock),
      status: form.status,
      featured: form.featured,
      description: form.description,
      images: [form.front, form.back, ...form.extra].filter(Boolean),
    };
    setSaving(true);
    try {
      if (editing === "new") await api("/api/admin/products", { method: "POST", auth: true, body });
      else await api(`/api/admin/products/${editing.id}`, { method: "PUT", auth: true, body });
      toast.success(editing === "new" ? "Product added" : "Product updated");
      setEditing(null);
      prods.reload();
      cats.reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    try {
      await api(`/api/admin/products/${p.id}`, { method: "DELETE", auth: true });
      toast.success("Product deleted");
      prods.reload();
      cats.reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[12rem] flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products"
              className={inputCls + " pl-9"}
            />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className={inputCls + " !w-auto"}>
            <option value="all">All categories</option>
            {cats.data.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.products})
              </option>
            ))}
          </select>
          <Btn onClick={openNew} className="flex items-center gap-2">
            <FiPlus /> Add product
          </Btn>
        </div>
      </Card>

      <Card title={`${list.length} products`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="py-2 font-medium">Product</th>
                <th className="py-2 font-medium">Category</th>
                <th className="py-2 font-medium">Price</th>
                <th className="py-2 font-medium">Stock</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((p) => (
                <tr key={p.id}>
                  <td className="py-2">
                    <div className="flex items-center gap-3">
                      <img src={p.first} alt="" className="h-14 w-11 rounded-md object-cover" />
                      <img src={p.second} alt="" className="hidden h-14 w-11 rounded-md object-cover sm:block" />
                      <span className="max-w-[16rem] font-medium">{p.title}</span>
                    </div>
                  </td>
                  <td className="py-2">{p.category}</td>
                  <td className="py-2 font-medium">{inr(p.price)}</td>
                  <td className="py-2">
                    <Badge tone={p.stock === 0 ? "rose" : p.stock <= 5 ? "amber" : "green"}>{p.stock}</Badge>
                  </td>
                  <td className="py-2">
                    <Badge tone={p.status === "active" ? "green" : "gray"}>{p.status}</Badge>
                  </td>
                  <td className="py-2">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} aria-label="Edit" className="rounded-lg p-2 text-gray-500 hover:bg-[#eef3ee]">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => remove(p)} aria-label="Delete" className="rounded-lg p-2 text-[#c8452a] hover:bg-[#fbeeea]">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="py-10 text-center text-gray-400">No products found</p>}
        </div>
      </Card>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === "new" ? "Add product" : "Edit product"} wide>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" className="sm:col-span-2">
              <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} required />
            </Field>
            <Field label="Price (₹)">
              <input className={inputCls} type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} required />
            </Field>
            <Field label="Category">
              <select className={inputCls} value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} required>
                {cats.data.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Stock">
              <input className={inputCls} type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
            </Field>
            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="active">Active (visible in store)</option>
                <option value="draft">Draft (hidden)</option>
              </select>
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <textarea className={inputCls} rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
            </Field>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-600">Images</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <ImageInput label="Front *" value={form.front} onChange={(u) => set("front", u)} />
              <ImageInput label="Back *" value={form.back} onChange={(u) => set("back", u)} hint="Shown on hover" />
              {form.extra.map((u, i) => (
                <ImageInput
                  key={i}
                  label={`Extra ${i + 1}`}
                  value={u}
                  onChange={(url) => set("extra", form.extra.map((x, j) => (j === i ? url : x)))}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Btn type="button" variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Btn>
            <Btn type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save product"}
            </Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
