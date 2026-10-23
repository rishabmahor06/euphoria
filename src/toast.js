// Tiny toast store. Use `toast.success("..")`, `toast.error("..")`, `toast.info("..")`
// from anywhere; <Toaster /> (Components/Toaster.jsx) renders them.

let items = [];
let nextId = 1;
const listeners = new Set();

const emit = () => listeners.forEach((l) => l(items));

export const subscribe = (fn) => {
  listeners.add(fn);
  fn(items);
  return () => listeners.delete(fn);
};

export const dismiss = (id) => {
  items = items.filter((t) => t.id !== id);
  emit();
};

const push = (type, message, duration = 3500) => {
  const text = String(message?.message ?? message ?? "");
  if (!text) return;
  // collapse an identical toast that is already on screen
  if (items.some((t) => t.type === type && t.message === text)) return;
  items = [...items.slice(-3), { id: nextId++, type, message: text, duration }];
  emit();
};

export const toast = {
  success: (msg, duration) => push("success", msg, duration),
  error: (msg, duration) => push("error", msg, duration),
  info: (msg, duration) => push("info", msg, duration),
  warning: (msg, duration) => push("warning", msg, duration),
};
