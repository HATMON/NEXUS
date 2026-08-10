export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: number;
  slug: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  image: string;
  badge: string;
  rating: number;
  reviews: number;
  stock: boolean;
  description: string;
  specs: ProductSpec[];
};

export const products: Product[] = [
  {
    id: 1,
    slug: "550w-jinko-solar-panel",
    sku: "EV-SP-001",
    name: "550W Jinko Solar Panel",
    category: "Solar Panels",
    price: 14500,
    oldPrice: 16500,
    image: "/products/jinko550.jpg",
    badge: "-12%",
    rating: 5,
    reviews: 48,
    stock: true,
    description:
      "A high-efficiency 550W monocrystalline solar panel suitable for residential, commercial and industrial solar installations.",
    specs: [
      { label: "Rated Power", value: "550W" },
      { label: "Cell Type", value: "Monocrystalline" },
      { label: "Brand", value: "Jinko Solar" },
      { label: "Warranty", value: "Manufacturer warranty" },
    ],
  },
  {
    id: 2,
    slug: "5kva-hybrid-inverter",
    sku: "EV-IN-002",
    name: "5KVA Hybrid Inverter",
    category: "Inverters",
    price: 62000,
    oldPrice: 70000,
    image: "/products/inverter5kva.jpg",
    badge: "-10%",
    rating: 5,
    reviews: 32,
    stock: true,
    description:
      "A reliable 5KVA hybrid inverter designed for solar, battery and grid-powered systems in homes and small businesses.",
    specs: [
      { label: "Capacity", value: "5KVA" },
      { label: "Type", value: "Hybrid Inverter" },
      { label: "Application", value: "Residential and commercial" },
      { label: "Warranty", value: "Manufacturer warranty" },
    ],
  },
  {
    id: 3,
    slug: "200ah-lithium-battery",
    sku: "EV-BT-003",
    name: "200Ah Lithium Battery",
    category: "Lithium Batteries",
    price: 95000,
    oldPrice: 108000,
    image: "/products/lithium200.jpg",
    badge: "-15%",
    rating: 5,
    reviews: 21,
    stock: true,
    description:
      "A long-life lithium battery designed for solar backup and off-grid systems requiring dependable energy storage.",
    specs: [
      { label: "Capacity", value: "200Ah" },
      { label: "Battery Type", value: "Lithium" },
      { label: "Application", value: "Solar backup and off-grid systems" },
      { label: "Warranty", value: "Manufacturer warranty" },
    ],
  },
  {
    id: 4,
    slug: "100w-complete-solar-kit",
    sku: "EV-SK-004",
    name: "100W Complete Solar Kit",
    category: "Solar Kits",
    price: 18999,
    oldPrice: 22500,
    image: "/products/kit100.jpg",
    badge: "-16%",
    rating: 5,
    reviews: 60,
    stock: true,
    description:
      "A complete 100W solar kit suitable for lighting, phone charging and other basic household or small-business power needs.",
    specs: [
      { label: "Panel Capacity", value: "100W" },
      { label: "System Type", value: "Complete Solar Kit" },
      { label: "Recommended Use", value: "Lighting and phone charging" },
      { label: "Warranty", value: "Manufacturer warranty" },
    ],
  },
];

export async function getAllProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  return products.find((product) => product.slug === slug);
}