// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mapaProductos: Record<string, string[]> = {
  'Tecnología': [
    'Monitor Gamer 144Hz', 'Teclado Mecanico RGB', 'Mouse Inalambrico', 
    'Notebook Pro 15', 'Auriculares Noise Cancelling', 'Tablet Gráfica', 
    'Smartwatch Series 5', 'Camara DSLR', 'Disco SSD 1TB', 'Smartphone X'
  ],
  'Ropa': [
    'Polera Estampada', 'Jeans Slim Fit', 'Zapatillas Running', 
    'Chaqueta Impermeable', 'Gorro de Lana', 'Calcetines Deportivos', 
    'Camisa Formal', 'Vestido de Verano', 'Shorts de Baño', 'Sudadera con Capucha'
  ],
  'Hogar': [
    'Lampara de Escritorio', 'Juego de Sabanas', 'Sarten Antiadherente', 
    'Batidora de Mano', 'Cafetera Express', 'Almohada Viscoelástica', 
    'Set de Cuchillos', 'Toallas de Baño', 'Espejo Decorativo', 'Mesa Lateral'
  ],
  'Deportes': [
    'Balon de Futbol', 'Pesas 5kg', 'Colchoneta Yoga', 
    'Raqueta de Tenis', 'Botella de Agua', 'Bicicleta de Montaña', 
    'Guantes de Boxeo', 'Cuerda para Saltar', 'Zapatillas Trekking', 'Bandas Elasticas'
  ],
  'Juguetes': [
    'Bloques de Construcción', 'Muñeca Articulada', 'Auto a Control Remoto', 
    'Juego de Mesa', 'Peluche Gigante', 'Rompecabezas 1000 pz', 
    'Set de Arte', 'Dinosaurio de Goma', 'Pistola de Agua', 'Drone para Niños'
  ]
};

const regiones = ['Norte', 'Sur', 'Este', 'Oeste', 'Centro'];

async function main() {
  await prisma.venta.deleteMany();

  const ventas = [];
  const categorias = Object.keys(mapaProductos);

  for (let i = 0; i < 200; i++) {
    const randomCategoria = categorias[Math.floor(Math.random() * categorias.length)];
    const productosDeLaCategoria = mapaProductos[randomCategoria];
    const randomProducto = productosDeLaCategoria[Math.floor(Math.random() * productosDeLaCategoria.length)];
    
    const randomRegion = regiones[Math.floor(Math.random() * regiones.length)];
    const randomMonto = Math.floor(Math.random() * (1500000 - 5000) + 5000);
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));

    ventas.push({
      producto: randomProducto,
      categoria: randomCategoria,
      monto: randomMonto,
      region: randomRegion,
      fecha: date,
    });
  }

  await prisma.venta.createMany({
    data: ventas,
  });

  console.log(`Se insertaron ${ventas.length} ventas correctamente.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });