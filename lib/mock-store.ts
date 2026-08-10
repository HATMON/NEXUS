export type AdminOrder = {
  _id: string;
  orderNumber: string;
  trackingCode: string;

  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };

  delivery: {
    county: string;
    town: string;
    address: string;
    notes?: string;
    method: string;
    fee: number;
  };

  payment: {
    method: string;
    status: "pending" | "paid" | "failed" | "refunded";
    reference?: string;
  };

  items: Array<{
    slug: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;

  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  status:
    | "pending-payment"
    | "payment-confirmed"
    | "processing"
    | "ready-for-dispatch"
    | "dispatched"
    | "out-for-delivery"
    | "delivered"
    | "cancelled";

  estimatedDelivery?: string | Date | null;
  trackingHistory: Array<{
    status: string;
    message: string;
    location?: string;
    date: string | Date;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type AdminProduct = {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  category: string;
  brand?: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  lowStockLevel: number;
  images: string[];
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

const initialProducts: AdminProduct[] = [
  {
    _id: "prod-1",
    name: "550W Jinko Solar Panel",
    slug: "550w-jinko-solar-panel",
    sku: "EV-SP-001",
    description:
      "A high-efficiency 550W monocrystalline solar panel suitable for residential, commercial and industrial solar installations.",
    shortDescription: "550W Monocrystalline Panel",
    category: "Solar Panels",
    brand: "Jinko Solar",
    price: 14500,
    compareAtPrice: 16500,
    stock: 45,
    lowStockLevel: 5,
    images: ["/products/jinko550.jpg"],
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "prod-2",
    name: "5KVA Hybrid Inverter",
    slug: "5kva-hybrid-inverter",
    sku: "EV-IN-002",
    description:
      "A reliable 5KVA hybrid inverter designed for solar, battery and grid-powered systems in homes and small businesses.",
    shortDescription: "5KVA Off-Grid & Grid-Tied Inverter",
    category: "Inverters",
    brand: "Must / Felicity",
    price: 62000,
    compareAtPrice: 70000,
    stock: 12,
    lowStockLevel: 3,
    images: ["/products/inverter5kva.jpg"],
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "prod-3",
    name: "200Ah Lithium Battery",
    slug: "200ah-lithium-battery",
    sku: "EV-BT-003",
    description:
      "A long-life lithium battery designed for solar backup and off-grid systems requiring dependable energy storage.",
    shortDescription: "200Ah 48V LiFePO4 Battery",
    category: "Lithium Batteries",
    brand: "Felicity Solar",
    price: 95000,
    compareAtPrice: 108000,
    stock: 8,
    lowStockLevel: 2,
    images: ["/products/lithium200.jpg"],
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "prod-4",
    name: "100W Complete Solar Kit",
    slug: "100w-complete-solar-kit",
    sku: "EV-SK-004",
    description:
      "A complete 100W solar kit suitable for lighting, phone charging and other basic household or small-business power needs.",
    shortDescription: "Complete Home Lighting & Charging Kit",
    category: "Solar Kits",
    brand: "EcoVolt",
    price: 18999,
    compareAtPrice: 22500,
    stock: 20,
    lowStockLevel: 5,
    images: ["/products/kit100.jpg"],
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialOrders: AdminOrder[] = [
  {
    _id: "ord-1",
    orderNumber: "EVN-260730-A1B2C3",
    trackingCode: "TRK-1002003004",
    customer: {
      firstName: "John",
      lastName: "Kamau",
      phone: "254712345678",
      email: "john.kamau@example.com",
    },
    delivery: {
      county: "Nairobi",
      town: "Kilimani",
      address: "Argwings Kodhek Road, Apt 4B",
      notes: "Call upon arrival",
      method: "standard",
      fee: 500,
    },
    payment: {
      method: "mpesa",
      status: "paid",
      reference: "QJK890123X",
    },
    items: [
      {
        slug: "550w-jinko-solar-panel",
        name: "550W Jinko Solar Panel",
        price: 14500,
        quantity: 2,
        total: 29000,
      },
    ],
    subtotal: 29000,
    deliveryFee: 500,
    total: 29500,
    currency: "KES",
    status: "processing",
    estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString(),
    trackingHistory: [
      {
        status: "pending-payment",
        message: "Your order has been received and is awaiting payment confirmation.",
        location: "EcoVolt Nexus",
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        status: "payment-confirmed",
        message: "Payment confirmed via M-Pesa (Ref: QJK890123X).",
        location: "EcoVolt Nexus",
        date: new Date(Date.now() - 86400000 * 1.5).toISOString(),
      },
      {
        status: "processing",
        message: "Your order is being prepared for dispatch.",
        location: "Nairobi Warehouse",
        date: new Date(Date.now() - 86400000 * 0.5).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
  },
];

export type AdminActivityLog = {
  _id: string;
  action: string;
  entityType: "order" | "product" | "system" | "notification";
  entityId?: string;
  details: string;
  performedBy: string;
  timestamp: string;
};

const initialActivityLogs: AdminActivityLog[] = [
  {
    _id: "act-1",
    action: "Order Dispatched",
    entityType: "order",
    entityId: "EVN-260730-A1B2C3",
    details: "Updated order status to processing",
    performedBy: "Admin User",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: "act-2",
    action: "Inventory Restocked",
    entityType: "product",
    entityId: "EV-SP-001",
    details: "Restocked Jinko Solar Panel 550W stock to 45 units",
    performedBy: "Admin User",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

declare global {
  var mockOrdersStore: AdminOrder[] | undefined;
  var mockProductsStore: AdminProduct[] | undefined;
  var mockActivityStore: AdminActivityLog[] | undefined;
  var mockStockAlertsStore: Array<{ id: string; productId: string; name: string; stock: number; limit: number; sentAt: string; recipient: string }> | undefined;
}

export function getMockActivityLogs(): AdminActivityLog[] {
  if (!global.mockActivityStore) {
    global.mockActivityStore = [...initialActivityLogs];
  }
  return global.mockActivityStore;
}

export function addMockActivityLog(
  log: Omit<AdminActivityLog, "_id" | "timestamp">,
): AdminActivityLog {
  const logs = getMockActivityLogs();
  const newLog: AdminActivityLog = {
    ...log,
    _id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newLog);
  return newLog;
}

export function getMockStockAlerts() {
  if (!global.mockStockAlertsStore) {
    global.mockStockAlertsStore = [];
  }
  return global.mockStockAlertsStore;
}

export function triggerLowStockEmail(product: AdminProduct, recipientEmail = "inventory-alerts@ecovolt.co.ke") {
  const alerts = getMockStockAlerts();
  const alert = {
    id: `alt-${Date.now()}`,
    productId: product._id,
    name: product.name,
    stock: product.stock,
    limit: product.lowStockLevel,
    sentAt: new Date().toISOString(),
    recipient: recipientEmail,
  };
  alerts.unshift(alert);

  addMockActivityLog({
    action: "Low Stock Alert Dispatched",
    entityType: "notification",
    entityId: product.sku,
    details: `Automated email alert sent to ${recipientEmail} for ${product.name} (Stock: ${product.stock}, Limit: ${product.lowStockLevel})`,
    performedBy: "System Automator",
  });

  return alert;
}

export function getMockOrders(): AdminOrder[] {
  if (!global.mockOrdersStore) {
    global.mockOrdersStore = [...initialOrders];
  }
  return global.mockOrdersStore;
}

export function addMockOrder(order: AdminOrder): AdminOrder {
  const orders = getMockOrders();
  orders.unshift(order);
  return order;
}

export function findMockOrder(reference: string, phone: string): AdminOrder | undefined {
  const orders = getMockOrders();
  const refUpper = reference.trim().toUpperCase();
  const phoneClean = phone.trim();

  return orders.find((ord) => {
    const matchesPhone = ord.customer.phone === phoneClean;
    const matchesRef =
      ord.orderNumber.toUpperCase() === refUpper ||
      ord.trackingCode.toUpperCase() === refUpper;
    return matchesPhone && matchesRef;
  });
}

export function updateMockOrder(
  orderId: string,
  updates: Partial<AdminOrder>,
  performedBy = "Admin User",
): AdminOrder | null {
  const orders = getMockOrders();
  const index = orders.findIndex((ord) => ord._id === orderId);
  if (index === -1) return null;

  const old = orders[index];
  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const changes: string[] = [];
  if (updates.status && updates.status !== old.status) {
    changes.push(`status to '${updates.status}'`);
  }
  if (updates.payment?.status && updates.payment.status !== old.payment?.status) {
    changes.push(`payment to '${updates.payment.status}'`);
  }

  addMockActivityLog({
    action: "Order Updated",
    entityType: "order",
    entityId: old.orderNumber,
    details: `Updated ${old.orderNumber} ${changes.length ? changes.join(", ") : "details"}`,
    performedBy,
  });

  return orders[index];
}

export function getMockProducts(): AdminProduct[] {
  if (!global.mockProductsStore) {
    global.mockProductsStore = [...initialProducts];
  }
  return global.mockProductsStore;
}

export function addMockProduct(
  product: Omit<AdminProduct, "_id" | "createdAt" | "updatedAt">,
  performedBy = "Admin User",
): AdminProduct {
  const products = getMockProducts();
  const newProduct: AdminProduct = {
    ...product,
    _id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.unshift(newProduct);

  addMockActivityLog({
    action: "Product Created",
    entityType: "product",
    entityId: newProduct.sku,
    details: `Created product '${newProduct.name}' (Price: KES ${newProduct.price}, Stock: ${newProduct.stock})`,
    performedBy,
  });

  if (newProduct.stock <= newProduct.lowStockLevel) {
    triggerLowStockEmail(newProduct);
  }

  return newProduct;
}

export function updateMockProduct(
  productId: string,
  updates: Partial<AdminProduct>,
  performedBy = "Admin User",
): AdminProduct | null {
  const products = getMockProducts();
  const index = products.findIndex((prod) => prod._id === productId);
  if (index === -1) return null;

  const old = products[index];
  const updatedProduct = {
    ...old,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  products[index] = updatedProduct;

  const changes: string[] = [];
  if (updates.stock !== undefined && updates.stock !== old.stock) {
    changes.push(`stock: ${old.stock} → ${updates.stock}`);
  }
  if (updates.price !== undefined && updates.price !== old.price) {
    changes.push(`price: KES ${updates.price}`);
  }
  if (updates.active !== undefined && updates.active !== old.active) {
    changes.push(`status: ${updates.active ? "Active" : "Disabled"}`);
  }

  addMockActivityLog({
    action: "Product Updated",
    entityType: "product",
    entityId: old.sku,
    details: `Updated '${old.name}' (${changes.length ? changes.join(", ") : "details"})`,
    performedBy,
  });

  // Low stock email trigger check
  if (updatedProduct.stock <= updatedProduct.lowStockLevel && old.stock > old.lowStockLevel) {
    triggerLowStockEmail(updatedProduct);
  }

  return updatedProduct;
}

export function deleteMockProduct(productId: string): boolean {
  const products = getMockProducts();
  const index = products.findIndex((prod) => prod._id === productId);
  if (index === -1) return false;

  products.splice(index, 1);
  return true;
}
