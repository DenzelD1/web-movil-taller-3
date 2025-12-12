"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ChartsPanel from "@/components/VentasChartsPanel";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearch, setFilterBy, setShowPanel, setDateFrom, setDateTo, setSortBy, setSortOrder, setChartType, reset } from "@/store/ventasSlice";

interface Venta {
  id: number;
  producto: string;
  categoria: string;
  monto: number;
  region: string | null;
  fecha: string;
}

export default function VentasTable() {
  const dispatch = useAppDispatch();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const { search, filterBy, showPanel, dateFrom, dateTo, sortBy, sortOrder, chartType } = useAppSelector((s) => s.ventasUI);

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

  // Estado global se persiste automáticamente desde el store

  const ventasFiltradas = useMemo(() => {
    let result = [...ventas];

    const q = search.trim().toLowerCase();
    if (q) {
      if (filterBy === "producto") {
        result = result.filter((v) => v.producto.toLowerCase().includes(q));
      } else if (filterBy === "categoria") {
        result = result.filter((v) => v.categoria.toLowerCase().includes(q));
      } else if (filterBy === "region") {
        result = result.filter((v) => (v.region ?? "").toLowerCase().includes(q));
      } else if (filterBy === "mes") {
        const m = parseInt(q, 10);
        result = Number.isNaN(m) || m < 1 || m > 12
          ? []
          : result.filter((v) => new Date(v.fecha).getMonth() + 1 === m);
      }
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((v) => new Date(v.fecha) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      result = result.filter((v) => new Date(v.fecha) <= to);
    }

    result.sort((a, b) => {
      let va: number | string = "";
      let vb: number | string = "";
      if (sortBy === "fecha") {
        va = new Date(a.fecha).getTime();
        vb = new Date(b.fecha).getTime();
      } else if (sortBy === "monto") {
        va = a.monto;
        vb = b.monto;
      } else if (sortBy === "producto") {
        va = a.producto.toLowerCase();
        vb = b.producto.toLowerCase();
      } else if (sortBy === "categoria") {
        va = a.categoria.toLowerCase();
        vb = b.categoria.toLowerCase();
      } else if (sortBy === "region") {
        va = (a.region ?? "").toLowerCase();
        vb = (b.region ?? "").toLowerCase();
      }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return result;
  }, [ventas, search, filterBy, dateFrom, dateTo, sortBy, sortOrder]);

  if (loading) return <div className="p-4">Cargando datos...</div>;

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <select
          className="text-black p-2.5 ml-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterBy}
          onChange={(e) => dispatch(setFilterBy(e.target.value as typeof filterBy))}
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
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />
        <input
          type="date"
          className="text-black p-2 mt-2 border border-gray-300 rounded-md"
          value={dateFrom}
          onChange={(e) => dispatch(setDateFrom(e.target.value))}
        />
        <input
          type="date"
          className="text-black p-2 mt-2 border border-gray-300 rounded-md"
          value={dateTo}
          onChange={(e) => dispatch(setDateTo(e.target.value))}
        />
        <select
          className="text-black p-2 mt-2 border border-gray-300 rounded-md"
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value as typeof sortBy))}
        >
          <option value="fecha">Ordenar por fecha</option>
          <option value="monto">Ordenar por monto</option>
          <option value="producto">Ordenar por producto</option>
          <option value="categoria">Ordenar por categoría</option>
          <option value="region">Ordenar por región</option>
        </select>
        <select
          className="text-black p-2 mt-2 border border-gray-300 rounded-md"
          value={sortOrder}
          onChange={(e) => dispatch(setSortOrder(e.target.value as typeof sortOrder))}
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
        <select
          className="text-black p-2 mt-2 border border-gray-300 rounded-md"
          value={chartType}
          onChange={(e) => dispatch(setChartType(e.target.value as typeof chartType))}
        >
          <option value="categorias">Gráfico categorías</option>
          <option value="region">Gráfico regiones</option>
          <option value="montoPorMes">Gráfico monto por mes</option>
          <option value="topProductos">Gráfico top productos</option>
          <option value="promedioPorCategoria">Gráfico promedio por categoría</option>
        </select>
        <button
          className="px-4 py-2 mt-1.5 mr-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => dispatch(setShowPanel(!showPanel))}
        >
          {showPanel ? "Ocultar gráficos" : "Mostrar gráficos"}
        </button>
        <button
          className="px-4 py-2 mt-1.5 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          onClick={() => dispatch(reset())}
        >
          Reiniciar filtros
        </button>
      </div>

      {showPanel && (
        <ChartsPanel ventas={ventasFiltradas} />
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
              <td className="px-6 py-4 font-medium text-gray-900">
                <Link href={`/ventas/${venta.id}`} className="text-blue-700 hover:underline">
                  {venta.producto}
                </Link>
              </td>
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
