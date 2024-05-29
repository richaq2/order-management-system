import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, fetchCustomers, fetchSaleOrders, createSaleOrder, addCustomer } from '../api';
import { Button, Box, useDisclosure, Tabs, TabList, TabPanels, Tab, TabPanel, Table, Thead, Tbody, Tr, Th, Td, IconButton, Flex } from '@chakra-ui/react';
import SaleOrderModal from './SaleOrderModal';
import CustomerModal from './CustomerModal';
import Toggle from './Toggle';
import { Heading } from '@chakra-ui/react';
import { useLogin } from '../contexts/LoginContext';

const SaleOrderPage = () => {
  const { isOpen: isSaleOrderModalOpen, onOpen: onOpenSaleOrderModal, onClose: onCloseSaleOrderModal } = useDisclosure();
  const { isOpen: isCustomerModalOpen, onOpen: onOpenCustomerModal, onClose: onCloseCustomerModal } = useDisclosure();
  const queryClient = useQueryClient();
  const { logout } = useLogin();

  const { data: products } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });
  const { data: customers } = useQuery({ queryKey: ['customers'], queryFn: fetchCustomers });
  const { data: saleOrders } = useQuery({ queryKey: ['orders'], queryFn: fetchSaleOrders });

  const mutation = useMutation({
    mutationFn: createSaleOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const addCustomerMutation = useMutation({
    mutationFn: addCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const handleCreateOrder = (order) => {
    mutation.mutate(order);
    onCloseSaleOrderModal();
  };

  const handleAddCustomer = (newCustomer) => {
    addCustomerMutation.mutate(newCustomer);
    onCloseCustomerModal();
  };

  return (
    <Box w='100%' p={4}>
      <Flex width='100%' align="center" mb={4}>
        <Button colorScheme='blue' onClick={onOpenSaleOrderModal}>+ Sale Order</Button>
        <Button colorScheme='teal' onClick={onOpenCustomerModal} ml={4}>+ Add Customer</Button>
        <Button justifyContent="flex-end" ml={4} onClick={logout} colorScheme="red">Logout</Button>
        <Toggle/>
      </Flex>
      <Tabs mt={4} isFitted variant='enclosed'>
        <TabList>
          <Tab className='tab_'>Active Sale Orders</Tab>
          <Tab className='tab_'>Completed Sale Orders</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Table variant='striped' colorScheme='gray'>
              <Thead>
                <Tr>
                  <Th>Order ID</Th>
                  <Th>Customer</Th>
                  <Th>Items</Th>
                  <Th>Invoice No</Th>
                  <Th>Invoice Date</Th>
                  <Th>Paid</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {saleOrders && saleOrders.map((order) => {
                  const customer = customers.find(c => c.id === order.customer_id);
                  const items = order.items?.map(item => {
                    const product = products.find(p => p.sku.some(s => s.id === item.sku_id));
                    const sku = product?.sku.find(s => s.id === item.sku_id);
                    return {
                      ...item,
                      productName: product?.name,
                      unit: sku?.unit
                    };
                  }) || [];
                  return (
                    <Tr key={order.id}>
                      <Td>{order.id}</Td>
                      <Td>{customer?.name}</Td>
                      <Td>
                        {items.map((item, index) => (
                          <Box key={index}>
                            {item.productName} - {item.quantity} {item.unit} @ ${item.price}
                          </Box>
                        ))}
                      </Td>
                      <Td>{order.invoice_no}</Td>
                      <Td>{new Date(order.invoice_date).toLocaleDateString()}</Td>
                      <Td className='paid'>{order.paid ? "Yes" : "No"}</Td>
                      <Td><button style={{
                        fontSize:'26px',
                        marginLeft:'8px'
                      }}>...</button>

                     
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TabPanel>
          <TabPanel>
            <Table variant='striped' colorScheme='gray'>
              <Thead>
                <Tr>
                  <Th>Order ID</Th>
                  <Th>Customer</Th>
                  <Th>Items</Th>
                  <Th>Invoice No</Th>
                  <Th>Invoice Date</Th>
                  <Th>Paid</Th>
                </Tr>
              </Thead>
              <Tbody>
                {saleOrders && saleOrders.map((order) => {
                  const customer = customers.find(c => c.id === order.customer_id);
                  const items = order.items?.map(item => {
                    const product = products.find(p => p.sku.some(s => s.id === item.sku_id));
                    const sku = product?.sku.find(s => s.id === item.sku_id);
                    return {
                      ...item,
                      productName: product?.name,
                      unit: sku?.unit
                    };
                  }) || [];
                  return (
                    <Tr key={order.id}>
                      <Td>{order.id}</Td>
                      <Td>{customer?.name}</Td>
                      <Td>
                        {items.map((item, index) => (
                          <Box key={index}>
                            {item.productName} - {item.quantity} {item.unit} @ ${item.price}
                          </Box>
                        ))}
                      </Td>
                      <Td>{order.invoice_no}</Td>
                      <Td>{new Date(order.invoice_date).toLocaleDateString()}</Td>
                      <Td>{order.paid ? "Yes" : "No"}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <SaleOrderModal isOpen={isSaleOrderModalOpen} onClose={onCloseSaleOrderModal} onSubmit={handleCreateOrder} products={products} customers={customers} />
      <CustomerModal isOpen={isCustomerModalOpen} onClose={onCloseCustomerModal} onSubmit={handleAddCustomer} />
    </Box>
  );
};

export default SaleOrderPage;
