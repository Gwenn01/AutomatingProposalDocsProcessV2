import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./pages/auth";
import ViewProposal from "./pages/implementor/ViewProposal";
import Overview from "./pages/admin/Overview";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import HomePage from "./pages/Landing/Home";
import AboutPage from "./pages/Landing/Abou";
import FeaturePage from "./pages/Landing/Features";
import GuidelinesPage from "./pages/Landing/Guidelines";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/implementor" element={<ViewProposal />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/feature" element={<FeaturePage />} />
        <Route path="/guidelines" element={<GuidelinesPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin" element={<Overview />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
