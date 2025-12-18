export interface IPlan {
  id: number;
  name: string;
  price: number;
  description: string[];
  months: number;
  pricePerMonth: number;
  features: string[];
  popular?: boolean;
  hidden?: boolean;
}

export const Plans: IPlan[] = [
  {
    id: 0,
    name: "Prueba",
    price: 1000, // COP por mes
    pricePerMonth: 1000,
    months: 1,
    description: ["Plan de prueba mensual"],
    features: [
      "Hasta 3 vehículos",
      "Gestión básica de rentas",
      "Soporte por email",
      "Panel de control básico",
      "Ideal para probar la plataforma"
    ],
    hidden: true, // Hidden by default, can be toggled
  },
  {
    id: 1,
    name: "Basic",
    price: 150000, // COP por mes
    pricePerMonth: 150000,
    months: 1,
    description: ["Plan mensual básico"],
    features: [
      "Hasta 10 vehículos",
      "Gestión básica de rentas",
      "Soporte por email",
      "Panel de control básico"
    ],
  },
  {
    id: 2,
    name: "Premium",
    price: 720000, // COP total (120k/mes x 6 meses)
    pricePerMonth: 120000,
    months: 6,
    description: ["Plan semestral con descuento"],
    features: [
      "Hasta 50 vehículos",
      "Gestión avanzada de rentas",
      "Soporte prioritario",
      "Reportes y estadísticas",
      "20% de descuento"
    ],
    popular: true,
  },
  {
    id: 3,
    name: "Enterprise",
    price: 1080000, // COP total (90k/mes x 12 meses)
    pricePerMonth: 90000,
    months: 12,
    description: ["Plan anual con máximo descuento"],
    features: [
      "Vehículos ilimitados",
      "Gestión completa de rentas",
      "Soporte 24/7",
      "Reportes avanzados y analytics",
      "API access",
      "40% de descuento"
    ],
  },
];

