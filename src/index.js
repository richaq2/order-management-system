import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LoginProvider } from './contexts/LoginContext';
import './index.css'; // Import your global CSS file

// Create a client
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Router>
          <LoginProvider>
            <App />
          </LoginProvider>
        </Router>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
