import React from 'react';
import { useForm } from 'react-hook-form';
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
} from '@chakra-ui/react';

const CustomerModal = ({ isOpen, onClose, onSubmit }) => {
  const { handleSubmit, register, reset } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset(); // reset form after submission
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Customer</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="customer-form" onSubmit={handleSubmit(handleFormSubmit)}>
            <FormControl isRequired>
              <FormLabel>Customer Name</FormLabel>
              <Input placeholder="Name" {...register('name')} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="Email" {...register('email')} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Pincode</FormLabel>
              <Input placeholder="Pincode" {...register('pincode')} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input placeholder="Location" {...register('location_name')} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Type</FormLabel>
              <Input placeholder="Type" {...register('type')} />
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} type="submit" form="customer-form">
            Add Customer
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CustomerModal;
