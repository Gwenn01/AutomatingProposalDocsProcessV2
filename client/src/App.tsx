import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./pages/auth";
import ViewProposal from "./pages/implementor/ViewProposal";
import Overview from "./pages/admin/Overview";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import HomePage from "./pages/Landing/Home";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/implementor" element={<ViewProposal />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin" element={<Overview />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
