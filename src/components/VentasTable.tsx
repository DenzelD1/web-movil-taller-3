"use client";

import { useEffect, useMemo, useState } from "react";
import ChartsPanel from "@/components/VentasChartsPanel";

interface Venta {
  id: number;
  producto: string;
  categoria: string;
  monto: number;
  region: string | null;
  fecha: string;
}

export default function VentasTable() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState<"producto" | "categoria" | "region" | "mes">("producto");
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const res = await fetch("/api/ventas"); 
        if (!res.ok) throw new Error("Error al cargar ventas");
        const data = await res.json();
        setVentas(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();

    const interval = setInterval(fetchVentas, 15000);
    return () => clearInterval(interval);
  }, []);

  const ventasFiltradas = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ventas;
    if (filterBy === "producto") {
      return ventas.filter((v) => v.producto.toLowerCase().includes(q));
    }
    if (filterBy === "categoria") {
      return ventas.filter((v) => v.categoria.toLowerCase().includes(q));
    }
    if (filterBy === "region") {
      return ventas.filter((v) => (v.region ?? "").toLowerCase().includes(q));
    }
    if (filterBy === "mes") {
      const m = parseInt(q, 10);
      if (Number.isNaN(m) || m < 1 || m > 12) return [];
      return ventas.filter((v) => new Date(v.fecha).getMonth() + 1 === m);
    }
    return ventas;
  }, [ventas, search, filterBy]);

  if (loading) return <div className="p-4">Cargando datos...</div>;

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <select
          className="text-black p-2.5 ml-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value as typeof filterBy)}
        >
          <option value="producto">Producto</option>
          <option value="categoria">Categoría</option>
          <option value="region">Región</option>
          <option value="mes">Mes</option>
        </select>
        <input
          type={filterBy === "mes" ? "number" : "text"}
          placeholder={
            filterBy === "producto"
              ? "Buscar por producto"
              : filterBy === "categoria"
              ? "Buscar por categoría"
              : filterBy === "region"
              ? "Buscar por región"
              : "Ingresar mes (1-12)"
          }
          className="text-black flex-1 p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="px-4 py-2 mt-1.5 mr-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setShowPanel((s) => !s)}
        >
          {showPanel ? "Ocultar gráficos" : "Mostrar gráficos"}
        </button>
      </div>

      {showPanel && (
        <ChartsPanel ventas={ventas} />
      )}
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Producto</th>
            <th className="px-6 py-3">Categoría</th>
            <th className="px-6 py-3">Región</th>
            <th className="px-6 py-3">Fecha</th>
            <th className="px-6 py-3 text-right">Monto</th>
          </tr>
        </thead>
        <tbody>
          {ventasFiltradas.map((venta) => (
            <tr key={venta.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">{venta.id}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{venta.producto}</td>
              <td className="px-6 py-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {venta.categoria}
                </span>
              </td>
              <td className="px-6 py-4">{venta.region || "N/A"}</td>
              <td className="px-6 py-4">
                {new Date(venta.fecha).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right font-bold">
                ${venta.monto.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
