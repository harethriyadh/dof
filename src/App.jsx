
import React from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home';
import Login from './components/auth/login.jsx';
import Register from './components/auth/register.jsx';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <div className="content" style={{
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          direction: 'rtl',
          textAlign: 'right'
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
