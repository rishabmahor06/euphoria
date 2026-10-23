import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FiUploadCloud } from "react-icons/fi";
import { api } from "../api";
import { toast } from "../toast";

export const inr = (n) => "₹" + Math.round(n || 0).toLocaleString("en-IN");
export const dateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";
export const dateOnly = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—";

// fetch helper: const { data, loading, error, reload } = useApi("/api/admin/x")
export const useApi = (path) => {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    api(path, { auth: true })
      .then((data) => setState({ data, loading: false, error: "" }))
      .catch((e) => setState({ data: null, loading: false, error: e.message }));
  }, [path]);
  useEffect(() => {
    load();
  }, [load]);
  return { ...state, reload: load };
};

export const Card = ({ title, action, children, className = "" }) => (
  <section className={"rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 " + className}>
    {(title || action) && (
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-[#1E381E]">{title}</h2>
        {action}
      </div>
    )}
    {children}
  </section>
);

export const Stat = ({ label, value, hint, icon, tone = "green" }) => {
  const tones = {
    green: "bg-[#eaf6ea] text-[#2e7d3b]",
    blue: "bg-[#e8effa] text-[#2f6fd6]",
    amber: "bg-[#fdf5e6] text-[#c27a14]",
    rose: "bg-[#fbeeea] text-[#c8452a]",
  };
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        {icon && (
          <span className={"flex h-9 w-9 items-center justify-center rounded-xl text-lg " + tones[tone]}>
            {React.createElement(icon)}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold text-[#1E381E]">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
};

const BADGE = {
  green: "bg-[#eaf6ea] text-[#2e7d3b]",
  blue: "bg-[#e8effa] text-[#2f6fd6]",
  amber: "bg-[#fdf5e6] text-[#b26a0a]",
  rose: "bg-[#fbeeea] text-[#c8452a]",
  gray: "bg-gray-100 text-gray-600",
};
export const Badge = ({ tone = "gray", children }) => (
  <span className={"inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize " + BADGE[tone]}>
    {children}
  </span>
);

export const Modal = ({ open, onClose, title, children, wide }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[8000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className={
          "relative max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl " +
          (wide ? "max-w-3xl" : "max-w-md")
        }
      >
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-2xl text-gray-500">
          <IoClose />
        </button>
        <h2 className="mb-4 text-xl font-bold text-[#1E381E]">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export const inputCls =
  "w-full rounded-lg border-2 border-[#e1ebe1] bg-white px-3 py-2 outline-none transition focus:border-[#1E381E]";

export const Field = ({ label, children, className = "" }) => (
  <label className={"block " + className}>
    <span className="mb-1 block text-sm font-medium text-gray-600">{label}</span>
    {children}
  </label>
);

export const Btn = ({ variant = "primary", className = "", ...p }) => {
  const v = {
    primary: "bg-[#1E381E] text-white hover:bg-[#264726]",
    ghost: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    danger: "bg-[#fbeeea] text-[#c8452a] hover:bg-[#f7ddd5]",
  }[variant];
  return (
    <button
      {...p}
      className={
        "rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed " +
        v +
        " " +
        className
      }
    />
  );
};

export const Spinner = () => (
  <div className="flex justify-center py-16">
    <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#cfe0cf] border-t-[#1E381E]" />
  </div>
);

export const ErrorBox = ({ message, onRetry }) => (
  <div className="rounded-2xl bg-[#fbeeea] p-6 text-center text-[#c8452a]">
    <p>{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="mt-3 rounded-lg bg-white px-4 py-1.5 text-sm text-gray-700 shadow-sm">
        Try again
      </button>
    )}
  </div>
);

// Upload one image (Cloudinary on the server) and report its URL.
export const ImageInput = ({ label, value, onChange, hint }) => {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    setBusy(true);
    try {
      const r = await api("/api/admin/upload", { method: "POST", auth: true, form });
      onChange(r.url);
      if (r.provider === "local") toast.info("Saved on the server disk (Cloudinary keys not set)");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {label && <span className="mb-1 block text-sm font-medium text-gray-600">{label}</span>}
      <div
        onClick={() => ref.current?.click()}
        className="group relative flex aspect-[3/4] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#cfe0cf] bg-[#f7faf7] hover:border-[#1E381E]"
      >
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="p-2 text-center text-xs text-gray-400">
            <FiUploadCloud className="mx-auto mb-1 text-2xl" />
            Click to upload
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="h-6 w-6 animate-spin rounded-full border-4 border-[#cfe0cf] border-t-[#1E381E]" />
          </div>
        )}
        {value && !busy && (
          <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-xs text-white opacity-0 group-hover:opacity-100">
            Change
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      <input ref={ref} type="file" accept="image/*" hidden onChange={pick} />
    </div>
  );
};
