export const loadInitialData = async () => {
    const customers = await fetch('/customers.json').then(res => res.json());
    const products = await fetch('/products.json').then(res => res.json());
    const orders = await fetch('/orders.json').then(res => res.json());
  
    if (!localStorage.getItem('customers')) {
      localStorage.setItem('customers', JSON.stringify(customers));
    }
    if (!localStorage.getItem('products')) {
      localStorage.setItem('products', JSON.stringify(products));
    }
    if (!localStorage.getItem('orders')) {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  };
  
  export const clearLocalStorage = () => {
    localStorage.removeItem('customers');
    localStorage.removeItem('products');
    localStorage.removeItem('orders');
    localStorage.removeItem('user');
  };
  