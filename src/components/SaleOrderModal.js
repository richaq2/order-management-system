import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
  SimpleGrid,
  HStack,
  Tag,
  Divider,
} from "@chakra-ui/react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SaleOrderModal = ({
  isOpen,
  onClose,
  onSubmit,
  products = [],
  customers = [],
}) => {
  const { handleSubmit, control, register, reset, watch } = useForm({
    defaultValues: {
      customer_id: "",
      items: [],
      paid: false,
      invoice_no: "",
      invoice_date: new Date(),
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "items",
  });

  const selectedItems = watch("items");

  const handleFormSubmit = (data) => {
    // Update local storage for products
    const updatedProducts = products.map((product) => {
      const updatedSkus = product.sku.map((sku) => {
        const item = data.items.find((i) => i.sku_id.value === sku.id);
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
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    onSubmit({
      ...data,
      items: data.items.map((item) => ({
        sku_id: item.sku_id.value,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity, 10),
      })),
    });
    reset();
  };

  const productOptions = products.flatMap((product) =>
    product.sku
      .filter((sku) => sku.quantity_in_inventory > 0) // Only show products that are in stock
      .map((sku) => ({
        value: sku.id,
        label: `${product.name} (${sku.variation_quantity} ${sku.unit})`,
        inventory: sku.quantity_in_inventory,
        price: sku.selling_price,
        key: `${product.name}-${sku.unit}-${sku.variation_quantity}-${sku.id}`, // Ensure unique key
      }))
  );

  const handleProductChange = (selectedOptions) => {
    const newItems = selectedOptions.map((option) => ({
      sku_id: option,
      price: "",
      quantity: "",
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
                    options={customers.map((customer) => ({
                      value: customer.id,
                      label: customer.name,
                    }))}
                    placeholder="Select customer"
                    onChange={field.onChange}
                    value={customers.find(
                      (customer) => customer.id === field.value
                    )}
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
                    value={selectedItems.map((item) => item.sku_id)}
                    placeholder="Select products"
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
            </FormControl>

            {fields.map((field, index) => (
              <Box key={field.id} mb={4}  borderWidth='1px' borderRadius='lg'p='3' >
                <HStack  spacing="9.2rem" direction='row' mb={2.5}>
                <Text fontSize={14} fontWeight="bold" color="gray.600"  >{field.label}</Text>
                <Tag bg="gray.100" color="gray.500"   ml="2">
                  Rate: ₹{field.variantPrice}
                </Tag>
                </HStack>
                <Divider />
                <SimpleGrid columns={2} spacing={10}  mt="2">
                  <Box>
                    <FormControl isRequired>
                      <FormLabel>Selling Rate</FormLabel>
                      <Input
                        type="number"
                        {...register(`items.${index}.price`)}
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl isRequired>
                      <FormLabel>Enter Quantity</FormLabel>
                      <Input
                        type="number"
                        {...register(`items.${index}.quantity`)}
                      />
                    </FormControl>
                  </Box>
                </SimpleGrid>
                <HStack spacing="8rem" direction='row'>

                <Button mt={2} colorScheme="red" onClick={() => remove(index)}>
                  Remove
                </Button>
                <Tag  bg="green.100" colorScheme='green'> {field.inventory} Item(s)&nbsp;Remaining</Tag>
                </HStack>
              </Box>
            ))}

            <FormControl isRequired mb={4}>
              <FormLabel>Invoice Date</FormLabel>

              <Controller
                control={control}
                name="invoice_date"
                render={({ field }) => (
                    <DatePicker 
                    selected={field.value}
                    onChange={field.onChange}
                    />
       
                )}
                />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Invoice Number</FormLabel>
              <Input type="text" {...register("invoice_no")} />
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            type="submit"
            form="sale-order-form"
          >
            Submit
          </Button>
          <Button  colorScheme="gray"  onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaleOrderModal;
