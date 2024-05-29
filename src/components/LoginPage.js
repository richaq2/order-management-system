import React, { useState,useEffect } from 'react';
import { Box, Button, Input, FormControl, FormLabel, Heading } from '@chakra-ui/react';
import { useLogin } from '../contexts/LoginContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useLogin();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        navigate('/orders');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/orders');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Heading as="h1" mb={6}>
        Login
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" width="full">
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;
