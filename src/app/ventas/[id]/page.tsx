import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function VentaDetallePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return (
      <main className="min-h-screen p-8 bg-gray-100">
        <div className="max-w-3xl mx-auto bg-white shadow rounded p-6">
          <h1 className="text-2xl font-bold mb-4">ID inválido</h1>
          <Link href="/" className="text-blue-600 hover:underline">Volver</Link>
        </div>
      </main>
    );
  }

  const venta = await prisma.venta.findUnique({ where: { id } });

  if (!venta) {
    return (
      <main className="min-h-screen p-8 bg-gray-100">
        <div className="max-w-3xl mx-auto bg-white shadow rounded p-6">
          <h1 className="text-2xl font-bold mb-4">Venta no encontrada</h1>
          <Link href="/" className="text-blue-600 hover:underline">Volver</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white shadow rounded p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Detalle de Venta #{venta.id}</h1>
          <Link href="/" className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700">Volver</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Producto</div>
            <div className="text-base font-medium text-gray-900">{venta.producto}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Categoría</div>
            <div className="text-base font-medium text-gray-900">{venta.categoria}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Región</div>
            <div className="text-base font-medium text-gray-900">{venta.region ?? "N/A"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Fecha</div>
            <div className="text-base font-medium text-gray-900">{new Date(venta.fecha).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Monto</div>
            <div className="text-base font-bold text-gray-900">${venta.monto.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
