"use client";

import { useMemo } from "react";

interface Venta {
  id: number;
  producto: string;
  categoria: string;
  monto: number;
  region: string | null;
  fecha: string;
}

export default function ChartsPanel({ ventas }: { ventas: Venta[] }) {
  const porCategoria = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of ventas) {
      map.set(v.categoria, (map.get(v.categoria) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [ventas]);

  const porRegion = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of ventas) {
      const key = v.region ?? "N/A";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [ventas]);

  const montoPorMes = useMemo(() => {
    const map = new Map<number, number>();
    for (const v of ventas) {
      const month = new Date(v.fecha).getMonth() + 1;
      map.set(month, (map.get(month) ?? 0) + v.monto);
    }
    const arr = Array.from(map.entries()).map(([name, value]) => ({ name: name.toString(), value }));
    arr.sort((a, b) => Number(a.name) - Number(b.name));
    return arr;
  }, [ventas]);

  const topProductos = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of ventas) {
      map.set(v.producto, (map.get(v.producto) ?? 0) + 1);
    }
    const arr = Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    arr.sort((a, b) => b.value - a.value);
    return arr.slice(0, 5);
  }, [ventas]);

  const promedioPorCategoria = useMemo(() => {
    const sum = new Map<string, number>();
    const count = new Map<string, number>();
    for (const v of ventas) {
      sum.set(v.categoria, (sum.get(v.categoria) ?? 0) + v.monto);
      count.set(v.categoria, (count.get(v.categoria) ?? 0) + 1);
    }
    const arr: { name: string; value: number }[] = [];
    for (const [cat, s] of sum.entries()) {
      const c = count.get(cat) ?? 1;
      arr.push({ name: cat, value: s / c });
    }
    return arr;
  }, [ventas]);

  return (
    <div className="mb-6 p-4 bg-white border rounded-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Panel de gráficos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChart title="Ventas por categoría" data={porCategoria} formatValue={(v) => v.toString()} />
        <BarChart title="Ventas por región" data={porRegion} formatValue={(v) => v.toString()} />
        <BarChart title="Monto total por mes" data={montoPorMes} formatValue={(v) => `$${Math.round(v).toLocaleString()}`} />
        <BarChart title="Top 5 productos (cantidad)" data={topProductos} formatValue={(v) => v.toString()} />
        <BarChart title="Monto promedio por categoría" data={promedioPorCategoria} formatValue={(v) => `$${Math.round(v).toLocaleString()}`} />
      </div>
    </div>
  );
}

function BarChart({ title, data, formatValue }: { title: string; data: { name: string; value: number }[]; formatValue: (v: number) => string }) {
  const max = useMemo(() => Math.max(1, ...data.map((d) => d.value)), [data]);
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={`${title}-${d.name}`} className="">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span className="font-medium">{d.name}</span>
              <span>{formatValue(d.value)}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-600 rounded"
                style={{ width: `${(d.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-xs text-gray-500">Sin datos</div>
        )}
      </div>
    </div>
  );
}
