"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ChartRow = {
  name: string;
  الإنجاز: number;
};

export function EmployeeProgressChart({ data }: { data: ChartRow[] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="الإنجاز" fill="#0f766e" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
