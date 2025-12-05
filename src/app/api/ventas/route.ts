import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ventaSchema } from "@/lib/validations";

export async function GET() {
    try {
        const ventas = await prisma.venta.findMany({
            orderBy: { fecha: 'desc'}
        })

        return NextResponse.json(ventas);
    } catch(error) {
        return NextResponse.json({message: "Error al cargar las ventas", error: (error as Error).message}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const validarDato = ventaSchema.parse(body);

        const nuevaVenta = await prisma.venta.create({
            data: validarDato,
        });

        return NextResponse.json(nuevaVenta, {status: 201});
    } catch(error: any) {
        if(error.name === 'ZodError') {
            return NextResponse.json({error: error.errors}, {status: 400})
        }
        return NextResponse.json({message: "Error al crear venta", error: (error as Error).message}, {status: 500});
    }
}