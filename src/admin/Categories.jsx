import React, { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { api } from "../api";
import { toast } from "../toast";
import { Card, Badge, Btn, Field, ImageInput, Modal, Spinner, ErrorBox, inputCls, useApi } from "./ui";

const GROUPS = [
  { id: "women", label: "Women's wear" },
  { id: "men", label: "Menswear" },
  { id: "jewellery", label: "Jewellery" },
];

const Categories = () => {
  const { data, error, reload } = useApi("/api/admin/categories");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", group: "women", image: "" });
  const [saving, setSaving] = useState(false);

  if (error) return <ErrorBox message={error} onRetry={reload} />;
  if (!data) return <Spinner />;

  const openNew = () => {
    setForm({ name: "", group: "women", image: "" });
    setEditing("new");
  };
  const openEdit = (c) => {
    setForm({ name: c.name, group: c.group, image: c.image || "" });
    setEditing(c);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing === "new") await api("/api/admin/categories", { method: "POST", auth: true, body: form });
      else await api(`/api/admin/categories/${editing.id}`, { method: "PUT", auth: true, body: form });
      toast.success(editing === "new" ? "Category added" : "Category updated");
      setEditing(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c) => {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    try {
      await api(`/api/admin/categories/${c.id}`, { method: "DELETE", auth: true });
      toast.success("Category deleted");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-gray-500">Group your products. The group decides where they appear in the store.</p>
        <Btn onClick={openNew} className="flex items-center gap-2">
          <FiPlus /> Add category
        </Btn>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {data.map((c) => (
          <Card key={c.id} className="!p-3">
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#f1f5f1]">
              {c.image ? (
                <img src={c.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">No image</div>
              )}
            </div>
            <div className="mt-3 flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-[#1E381E]">{c.name}</p>
                <p className="text-xs text-gray-400">{c.products} products</p>
              </div>
              <Badge tone="blue">{c.group}</Badge>
            </div>
            <div className="mt-3 flex gap-2">
              <Btn variant="ghost" className="flex-1 !py-1.5" onClick={() => openEdit(c)}>
                <FiEdit2 className="mr-1 inline" /> Edit
              </Btn>
              <Btn variant="danger" className="!py-1.5" onClick={() => remove(c)} aria-label="Delete">
                <FiTrash2 />
              </Btn>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === "new" ? "Add category" : "Edit category"}>
        <form onSubmit={save} className="space-y-4">
          <Field label="Name">
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Store section">
            <select className={inputCls} value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })}>
              {GROUPS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="w-40">
            <ImageInput label="Cover image" value={form.image} onChange={(u) => setForm({ ...form, image: u })} />
          </div>
          <div className="flex justify-end gap-2">
            <Btn type="button" variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Btn>
            <Btn type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
