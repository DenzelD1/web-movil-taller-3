# Taller 3 - Web Movil

## Integrantes

Denzel Delgado Urquieta, 21.401.250-2
    
Darwin Tapia Urrutia, 21.599.630-1

Juan Ignacio Castro, 21.219.278-3

Martin Adones Tapia, 21.293.739-8

## Requisitos

- Node.js 18+ (recomendado 20)
- Base de datos PostgreSQL

## Configurar entorno

1. Instalar dependencias: `npm install`
2. Crear archivo `.env` con:
   - `DATABASE_URL=postgresql://usuario:password@host:puerto/db?schema=public`

## Desarrollo

1. Generar cliente Prisma: `npx prisma generate`
2. Aplicar migraciones (dev): `npx prisma migrate dev`
3. Poblar datos: `npx prisma db seed`
4. Levantar servidor: `npm run dev`
   - Abrir `http://localhost:3000`

## Producción

1. Aplicar migraciones: `npx prisma migrate deploy`
2. Construir: `npm run build`
3. Ejecutar: `npm run start`

## Docker (opcional)

- Construir imagen: `docker build -t web-movil-taller-3 .`
- Migraciones: `docker run --rm -e DATABASE_URL="postgresql://..." web-movil-taller-3 npx prisma migrate deploy`
- Seed: `docker run --rm -e DATABASE_URL="postgresql://..." web-movil-taller-3 npx prisma db seed`
- Ejecutar app: `docker run -d -p 3000:3000 -e DATABASE_URL="postgresql://..." --name web-movil web-movil-taller-3`
