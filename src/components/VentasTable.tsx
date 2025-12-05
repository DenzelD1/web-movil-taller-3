"use client";

import { useEffect, useState } from "react";

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
  }, []);

  if (loading) return <div className="p-4">Cargando datos...</div>;

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
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
          {ventas.map((venta) => (
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