import Button from '@/atom/Button';

import React, { useReducer } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Intro from '@/pages/Intro';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import Main from "@/pages/Main";
import Temp from "@/pages/Temp";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/login/:provider" element={ <Login /> }/>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/main" element={<Main />} />
          <Route path="/temp" element={<Temp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
