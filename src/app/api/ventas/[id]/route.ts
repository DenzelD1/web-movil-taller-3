import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ventaSchema } from "@/lib/validations";

interface Params {
    params: Promise<{id: string}>
}

export async function GET(request: Request, { params }: Params) {
    try {
        const {id} = await params;
        const venta = prisma.venta.findUnique({
            where: {id: Number(id)},
        });

        if(!venta) {
            return NextResponse.json({error: "No se ha encontrado la venta especifica"}, {status: 404});
        }

        return NextResponse.json(venta);
    } catch(error) {
        return NextResponse.json({message: "Error al buscar la venta", error: (error as Error).message}, {status: 500});
    }
}

export async function PUT(request: Request, { params }: Params) {
    try {
        const {id} = await params;
        const body = await request.json();

        const validarDato = ventaSchema.partial().parse(body);

        const ventaActualizada = await prisma.venta.update({
            where: {id: Number(id)},
            data: validarDato
        });

        return NextResponse.json(ventaActualizada);
    } catch(error) {
        return NextResponse.json({message: "No se ha podido actualizar la venta especifica", error: (error as Error).message} , {status: 400});
    }
}

export async function DELETE(request: Request, { params }: Params) {
    try {
        const {id} = await params;
        await prisma.venta.delete({
            where: {id: Number(id)},
        })

        return NextResponse.json({message: "Venta eliminada correctamente"})
    } catch(error) {
        return NextResponse.json({message: "Error al eliminar venta", error: (error as Error).message}, {status: 500})
    }
    
}