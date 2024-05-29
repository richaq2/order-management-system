import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SaleOrderPage from './components/SaleOrderPage';
import LoginPage from './components/LoginPage';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './contexts/LoginContext';
import './App.css'
import {
  ThemeProvider,
  theme,
  ColorModeProvider,
  CSSReset,
} from "@chakra-ui/react";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const savedUser = localStorage.getItem('user');
    if (savedUser) {
      navigate('/orders');
    }
  const { user } = useLogin();
  return user ? children : <Navigate to="/login" />;
};

const App = () => (
  <ThemeProvider theme={theme}>
  <ColorModeProvider>
    <CSSReset />
    <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/orders"
      element={
        <PrivateRoute>
          <SaleOrderPage />
        </PrivateRoute>
      }
    />
  </Routes>
  </ColorModeProvider>
</ThemeProvider>
  
);

export default App;
