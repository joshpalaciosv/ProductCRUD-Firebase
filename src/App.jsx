import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import Login from './components/Login';
import Layout from './components/Layout';
import Principal from './components/Principal';
import Products from './components/Products';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(!!auth);
  }, []);

  return (
    //<CssVarsProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route 
            path="/"
            element={
              isAuthenticated ? (
                <Layout setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            
            <Route path="products" element={<Products />} />
            {/* <Route path="products" element={<Products />} /> */}
            
            <Route path="/" element={<Principal />} />
          </Route>
        </Routes>
      </BrowserRouter>
    //</CssVarsProvider>
  );
}

export default App;