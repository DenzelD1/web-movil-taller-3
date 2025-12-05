import { z } from "zod";

export const ventaSchema = z.object({
    producto: z.string().min(3, "El nombre del producto debe de tener al menos 3 caracteres"),
    categoria: z.string().min(1, "La categoria es obligatoria"),
    monto: z.coerce.number().positive("El monto debe ser positivo"),
    region: z.string().nullable().optional(),
    fecha: z.coerce.date().default(() => new Date())
});