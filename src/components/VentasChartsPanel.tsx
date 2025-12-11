"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart as RPieChart,
  Pie,
  Cell,
  LineChart as RLineChart,
  Line,
  RadarChart as RRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface Venta {
  id: number;
  producto: string;
  categoria: string;
  monto: number;
  region: string | null;
  fecha: string;
}

export default function ChartsPanel({ ventas }: { ventas: Venta[] }) {
  const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#06b6d4", "#a78bfa", "#ec4899"];
  const porCategoria = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of ventas) {
      map.set(v.categoria, (map.get(v.categoria) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([name, valor]) => ({ name, valor }));
  }, [ventas]);

  const porRegion = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of ventas) {
      const key = v.region ?? "N/A";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([name, valor]) => ({ name, valor }));
  }, [ventas]);

  const montoPorMes = useMemo(() => {
    const map = new Map<number, number>();
    for (const v of ventas) {
      const month = new Date(v.fecha).getMonth() + 1;
      map.set(month, (map.get(month) ?? 0) + v.monto);
    }
    const arr = Array.from(map.entries()).map(([name, valor]) => ({ name: name.toString(), valor }));
    arr.sort((a, b) => Number(a.name) - Number(b.name));
    return arr;
  }, [ventas]);

  const topProductos = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of ventas) {
      map.set(v.producto, (map.get(v.producto) ?? 0) + 1);
    }
    const arr = Array.from(map.entries()).map(([name, valor]) => ({ name, valor }));
    arr.sort((a, b) => b.valor - a.valor);
    return arr.slice(0, 5);
  }, [ventas]);

  const promedioPorCategoria = useMemo(() => {
    const sum = new Map<string, number>();
    const count = new Map<string, number>();
    for (const v of ventas) {
      sum.set(v.categoria, (sum.get(v.categoria) ?? 0) + v.monto);
      count.set(v.categoria, (count.get(v.categoria) ?? 0) + 1);
    }
    const arr: { name: string; valor: number }[] = [];
    for (const [cat, s] of sum.entries()) {
      const c = count.get(cat) ?? 1;
      arr.push({ name: cat, valor: s / c });
    }
    return arr;
  }, [ventas]);

  return (
    <div className="mb-6 p-4 bg-white border rounded-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Panel de gráficos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Ventas por categoría</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RBarChart data={porCategoria}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valor" fill="#3b82f6" />
            </RBarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Ventas por región</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RPieChart>
              <Pie data={porRegion} dataKey="valor" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {porRegion.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RPieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Monto total por mes</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RLineChart data={montoPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => `$${Math.round((v as number)).toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="valor" stroke="#ef4444" dot={false} />
            </RLineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Top 5 productos vendidos (cantidad)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RRadarChart data={topProductos}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar dataKey="valor" stroke="#22c55e" fill="#22c55e" fillOpacity={0.5} />
              <Tooltip formatter={(v) => [v as number, "Cantidad"]} />
              <Legend />
            </RRadarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Monto promedio por categoría</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RBarChart data={promedioPorCategoria} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip formatter={(v) => `$${Math.round((v as number)).toLocaleString()}`} />
              <Legend />
              <Bar dataKey="valor" fill="#06b6d4" />
            </RBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
