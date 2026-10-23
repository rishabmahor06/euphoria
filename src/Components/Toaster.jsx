import React, { useEffect, useRef, useState } from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";
import { FaCheck, FaInfo } from "react-icons/fa";
import { subscribe, dismiss } from "../toast";

// Pastel pill toasts: tinted background + border, coloured icon tile, close button.
const STYLES = {
  success: {
    box: "bg-[#eaf6ea] border-[#bfe3bf]",
    tile: "bg-[#4caf62]",
    icon: <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#4caf62] text-xs"><FaCheck /></span>,
  },
  info: {
    box: "bg-[#e8effa] border-[#b5c9ea]",
    tile: "bg-[#2f6fd6]",
    icon: <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#2f6fd6] text-xs"><FaInfo /></span>,
  },
  warning: {
    box: "bg-[#fdf5e6] border-[#f2d9a8]",
    tile: "bg-[#e8982f]",
    icon: <FiAlertTriangle className="text-white text-xl" />,
  },
  error: {
    box: "bg-[#fbeeea] border-[#efc3b8]",
    tile: "bg-[#de5b3b]",
    icon: <FiAlertTriangle className="text-white text-xl" />,
  },
};

const ToastItem = ({ toast }) => {
  const { id, type, message, duration } = toast;
  const s = STYLES[type] || STYLES.info;
  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);
  const remaining = useRef(duration);
  const startedAt = useRef(0);

  const close = () => {
    setLeaving(true);
    setTimeout(() => dismiss(id), 250);
  };

  // auto-dismiss timer that pauses while the pointer is over the toast
  useEffect(() => {
    if (paused || leaving) return;
    startedAt.current = Date.now();
    const t = setTimeout(close, remaining.current);
    return () => {
      clearTimeout(t);
      remaining.current -= Date.now() - startedAt.current;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, leaving]);

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={
        "pointer-events-auto flex max-w-full items-center gap-3 rounded-2xl border p-2 pr-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] " +
        s.box +
        " " +
        (leaving ? "toast-out" : "toast-in")
      }
    >
      <span className={"flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-md " + s.tile}>
        {s.icon}
      </span>
      <p className="min-w-0 px-1 text-[15px] font-medium text-gray-700 break-words">{message}</p>
      <button
        onClick={close}
        aria-label="Dismiss"
        className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-white/70 hover:text-gray-800"
      >
        <FiX />
      </button>
    </div>
  );
};

const Toaster = () => {
  const [list, setList] = useState([]);
  useEffect(() => subscribe(setList), []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[10000] flex flex-col items-center gap-3 px-3 sm:top-5">
      {list.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
};

export default Toaster;
