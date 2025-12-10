import VentasTable from "@/components/VentasTable";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Datos de DataMobile en BD para dashboard :P
      </h1>
      <VentasTable />
    </main>
  );
}
