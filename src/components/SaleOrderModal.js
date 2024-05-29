import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  Text,
} from '@chakra-ui/react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SaleOrderModal = ({ isOpen, onClose, onSubmit, products = [], customers = [] }) => {
  const { handleSubmit, control, register, reset, watch } = useForm({
    defaultValues: {
      customer_id: '',
      items: [],
      paid: false,
      invoice_no: '',
      invoice_date: new Date(),
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'items',
  });

  const selectedItems = watch('items');

  const handleFormSubmit = (data) => {
    // Update local storage for products
    const updatedProducts = products.map(product => {
      const updatedSkus = product.sku.map(sku => {
        const item = data.items.find(i => i.sku_id.value === sku.id);
        if (item) {
          return {
            ...sku,
            quantity_in_inventory: sku.quantity_in_inventory - item.quantity,
          };
        }
        return sku;
      });
      return { ...product, sku: updatedSkus };
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    onSubmit({
      ...data,
      items: data.items.map(item => ({
        sku_id: item.sku_id.value,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity, 10),
      })),
    });
    reset();
  };

  const productOptions = products.flatMap(product =>
    product.sku
      .filter(sku => sku.quantity_in_inventory > 0) // Only show products that are in stock
      .map(sku => ({
        value: sku.id,
        label: `${product.name} (${sku.variation_quantity} ${sku.unit})`,
        inventory: sku.quantity_in_inventory,
        price: sku.selling_price,
        key: `${product.name}-${sku.unit}-${sku.variation_quantity}-${sku.id}`, // Ensure unique key
      }))
  );

  const handleProductChange = (selectedOptions) => {
    const newItems = selectedOptions.map(option => ({
      sku_id: option,
      price: '',
      quantity: '',
      label: option.label,
      inventory: option.inventory,
      variantPrice: option.price,
    }));
    replace(newItems); // Replace the items array with the new selection
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Sale Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="sale-order-form" onSubmit={handleSubmit(handleFormSubmit)}>
            <FormControl isRequired mb={4}>
              <FormLabel>Customer</FormLabel>
              <Controller
                name="customer_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={customers.map(customer => ({
                      value: customer.id,
                      label: customer.name,
                    }))}
                    placeholder="Select customer"
                    onChange={field.onChange}
                    value={customers.find(customer => customer.id === field.value)}
                  />
                )}
              />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Products</FormLabel>
              <Controller
                name="items"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={productOptions}
                    isMulti
                    onChange={handleProductChange}
                    value={selectedItems.map(item => item.sku_id)}
                    placeholder="Select products"
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
            </FormControl>

            {fields.map((field, index) => (
              <Box key={field.id} mb={4}>
                <Text fontWeight="bold">{field.label}</Text>
                <Text color="gray.500">Inventory: {field.inventory} | Price: ₹{field.variantPrice}</Text>
                <FormControl isRequired>
                  <FormLabel>Selling Rate</FormLabel>
                  <Input
                    type="number"
                    {...register(`items.${index}.price`)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Enter Quantity</FormLabel>
                  <Input
                    type="number"
                    {...register(`items.${index}.quantity`)}
                  />
                </FormControl>
                <Button mt={2} colorScheme="red" onClick={() => remove(index)}>
                  Remove Item
                </Button>
              </Box>
            ))}

            <FormControl isRequired mb={4}>
              <FormLabel>Invoice Date</FormLabel>
              <Controller
                control={control}
                name="invoice_date"
                render={({ field }) => (
                  <DatePicker selected={field.value} onChange={field.onChange} />
                )}
              />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Invoice Number</FormLabel>
              <Input type="text" {...register('invoice_no')} />
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} type="submit" form="sale-order-form">
            Submit
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaleOrderModal;
