"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/utils/format";

export function RevenueChart({ data, dataKey = "revenue", valueFormatter = formatCurrency }) {
  const hasData = data?.some((point) => point[dataKey] > 0);

  if (!hasData) {
    return (
      <div className="flex h-64 items-center justify-center border border-border text-sm text-muted">
        No activity in this period yet.
      </div>
    );
  }

  return (
    <div className="h-64 w-full border border-border p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            interval={6}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={50} />
          <Tooltip
            formatter={(value) => valueFormatter(value)}
            labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
            contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", fontSize: 12 }}
          />
          <Area type="monotone" dataKey={dataKey} stroke="var(--accent)" fill="url(#revenueFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
