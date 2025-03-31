
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Tree from "./pages/Tree";
import Persona from "./pages/Persona";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

const App = () => (
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tree" element={<Tree />} />
        <Route path="/persona/:id" element={<Persona />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    <Toaster />
  </>
);

export default App;
