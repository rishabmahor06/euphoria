import React, { useState } from "react";

const short = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

// Smooth-ish area chart. data: [{ date, <valueKey> }]
export const AreaChart = ({ data, valueKey = "value", color = "#1E381E", format = (v) => v, height = 200 }) => {
  const [hover, setHover] = useState(null);
  const W = 600;
  const H = height;
  const pad = { l: 8, r: 8, t: 14, b: 22 };
  const max = Math.max(1, ...data.map((d) => d[valueKey]));
  const x = (i) => pad.l + (i * (W - pad.l - pad.r)) / Math.max(1, data.length - 1);
  const y = (v) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const pts = data.map((d, i) => [x(i), y(d[valueKey])]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = `${line} L${x(data.length - 1)} ${H - pad.b} L${x(0)} ${H - pad.b} Z`;
  const gid = "g" + color.replace("#", "");
  const ticks = [0, Math.floor((data.length - 1) / 2), data.length - 1];

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const rel = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((rel - pad.l) / (W - pad.l - pad.r)) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={pad.l} x2={W - pad.r} y1={y(max * f)} y2={y(max * f)} stroke="#e5ece5" strokeDasharray="3 4" />
        ))}
        <path d={area} fill={`url(#${gid})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {ticks.map((i) => (
          <text key={i} x={x(i)} y={H - 4} textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"} fontSize="11" fill="#9aa59a">
            {short(data[i].date)}
          </text>
        ))}
        {hover !== null && (
          <>
            <line x1={pts[hover][0]} x2={pts[hover][0]} y1={pad.t} y2={H - pad.b} stroke={color} strokeOpacity="0.3" />
            <circle cx={pts[hover][0]} cy={pts[hover][1]} r="5" fill="#fff" stroke={color} strokeWidth="2.5" />
          </>
        )}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -top-1 rounded-lg bg-[#1E381E] px-2.5 py-1 text-xs text-white shadow"
          style={{ left: `${(pts[hover][0] / W) * 100}%`, transform: "translateX(-50%)" }}
        >
          {short(data[hover].date)} · {format(data[hover][valueKey])}
        </div>
      )}
    </div>
  );
};

// Horizontal bars. items: [{ name, value }]
export const HBars = ({ items, format = (v) => v, color = "#1E381E" }) => {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (!items.length) return <p className="py-6 text-center text-sm text-gray-400">No data yet</p>;
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i.name}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-gray-600">{i.name}</span>
            <span className="font-medium text-[#1E381E]">{format(i.value)}</span>
          </div>
          <div className="h-2 rounded-full bg-[#eef3ee]">
            <div className="h-2 rounded-full" style={{ width: `${(i.value / max) * 100}%`, background: color }} />
          </div>
        </li>
      ))}
    </ul>
  );
};

// Small vertical bar sparkline-ish chart for counts per day
export const MiniBars = ({ data, color = "#2f6fd6", height = 90 }) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div>
      <div className="flex items-end gap-[3px]" style={{ height }}>
        {data.map((d) => (
          <div
            key={d.date}
            title={`${short(d.date)}: ${d.value}`}
            className="flex-1 rounded-t"
            style={{ height: `${Math.max(4, (d.value / max) * 100)}%`, background: d.value ? color : "#e8eee8" }}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-gray-400">
        <span>{short(data[0].date)}</span>
        <span>{short(data[data.length - 1].date)}</span>
      </div>
    </div>
  );
};
