import Button from '@/atom/Button';

import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Intro from '@/pages/Intro';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import Main from "@/pages/Main";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/login/:provider" element={ <Login /> }/>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/main" element={<Main />} />
        </Routes>
      </BrowserRouter>
      {/*<Button className="bg-sky-600 hover:bg-sky-700 active:bg-sky-800">*/}
      {/*  Button*/}
      {/*</Button>*/}
    </div>
  );
}

export default App;
