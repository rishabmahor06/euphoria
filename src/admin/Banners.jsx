import React, { useState } from "react";
import { FiTrash2, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { api } from "../api";
import { toast } from "../toast";
import { Card, Badge, Btn, ImageInput, Spinner, ErrorBox, useApi } from "./ui";

// Each section is a spot on the store front that can be changed from here.
const SECTIONS = [
  { id: "hero", label: "Home banner", note: "Big slider at the top of the home page (wide image, around 1600x700)." },
  { id: "menswear", label: "Menswear", note: "Two images in the Menswear block on the home page (add 2)." },
  { id: "promo", label: "Ready to ship strip", note: "Wide strip under the product carousel on the home page." },
];

const Banners = () => {
  const { data, error, reload } = useApi("/api/admin/banners");
  const [section, setSection] = useState("hero");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  if (error) return <ErrorBox message={error} onRetry={reload} />;
  if (!data) return <Spinner />;

  const current = SECTIONS.find((s) => s.id === section);
  const list = data.filter((b) => b.section === section).sort((a, b) => a.order - b.order);

  const add = async () => {
    if (!image) return toast.warning("Upload an image first");
    setSaving(true);
    try {
      await api("/api/admin/banners", { method: "POST", auth: true, body: { section, image } });
      toast.success("Image added");
      setImage("");
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const patch = async (b, body) => {
    try {
      await api(`/api/admin/banners/${b.id}`, { method: "PUT", auth: true, body });
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const move = async (b, dir) => {
    const i = list.findIndex((x) => x.id === b.id);
    const other = list[i + dir];
    if (!other) return;
    await Promise.all([patch(b, { order: other.order }), patch(other, { order: b.order })]);
  };

  const remove = async (b) => {
    if (!confirm("Delete this image?")) return;
    try {
      await api(`/api/admin/banners/${b.id}`, { method: "DELETE", auth: true });
      toast.success("Image deleted");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={
              "rounded-full border px-4 py-1.5 text-sm transition " +
              (section === s.id
                ? "border-[#1E381E] bg-[#1E381E] text-white"
                : "border-gray-300 bg-white text-[#1E381E] hover:border-[#1E381E]")
            }
          >
            {s.label}
            <span className="ml-1.5 opacity-70">{data.filter((b) => b.section === s.id).length}</span>
          </button>
        ))}
      </div>

      <Card title={`Add to: ${current.label}`}>
        <p className="mb-4 text-sm text-gray-500">{current.note} If a section has no images, the store uses its default pictures.</p>
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-40">
            <ImageInput value={image} onChange={setImage} />
          </div>
          <Btn onClick={add} disabled={saving || !image}>
            {saving ? "Adding..." : "Add image"}
          </Btn>
        </div>
      </Card>

      <Card title={`${current.label} images`}>
        {list.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">No custom images. The default store pictures are showing.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {list.map((b, i) => (
              <div key={b.id} className="rounded-xl ring-1 ring-black/5">
                <div className="aspect-[4/3] overflow-hidden rounded-t-xl bg-[#f1f5f1]">
                  <img src={b.image} alt="" className={"h-full w-full object-cover " + (b.active ? "" : "opacity-40")} />
                </div>
                <div className="flex items-center justify-between gap-2 p-3">
                  <button onClick={() => patch(b, { active: !b.active })}>
                    <Badge tone={b.active ? "green" : "gray"}>{b.active ? "Showing" : "Hidden"}</Badge>
                  </button>
                  <div className="flex gap-1">
                    <button disabled={i === 0} onClick={() => move(b, -1)} className="rounded p-1.5 text-gray-500 hover:bg-[#eef3ee] disabled:opacity-30" aria-label="Move up">
                      <FiArrowUp />
                    </button>
                    <button disabled={i === list.length - 1} onClick={() => move(b, 1)} className="rounded p-1.5 text-gray-500 hover:bg-[#eef3ee] disabled:opacity-30" aria-label="Move down">
                      <FiArrowDown />
                    </button>
                    <button onClick={() => remove(b)} className="rounded p-1.5 text-[#c8452a] hover:bg-[#fbeeea]" aria-label="Delete">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Banners;
