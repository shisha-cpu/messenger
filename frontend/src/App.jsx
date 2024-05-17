import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Components/HomePage';
import Reg from './Components/Header/Auth/Reg';
import Login from './Components/Header/Auth/Login';
import Header from './Components/Header/Header';

import './index.css'
function App() {
  return (
    <>  
    <Header />
     <div className="container">
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Reg />} />
          <Route path="/login" element={<Login />} />
      </Routes>
      </div>
      </>
    

  );
}

export default App;
