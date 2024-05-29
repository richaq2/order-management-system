let customers = [];
let products = [];
let saleOrders = [];

const fetchJSON = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const initializeData = async () => {
  customers = await fetchJSON('/customers.json');
  products = await fetchJSON('/products.json');
  saleOrders = await fetchJSON('/orders.json');
};

export const fetchProducts = async () => {
  if (products.length === 0) await initializeData();
  return products;
};

export const fetchCustomers = async () => {
  if (customers.length === 0) await initializeData();
  return customers;
};

export const fetchSaleOrders = async () => {
  if (saleOrders.length === 0) await initializeData();
  return saleOrders;
};

export const createSaleOrder = async (order) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newOrder = { ...order, id: new Date().getTime() };
      saleOrders.push(newOrder);
      resolve(newOrder);
    }, 500);
  });
};

export const addCustomer = async (customer) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCustomer = { ...customer, id: new Date().getTime() };
      customers.push(newCustomer);
      resolve(newCustomer);
    }, 500);
  });
};
