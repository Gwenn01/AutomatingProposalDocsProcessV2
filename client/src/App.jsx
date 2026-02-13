import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import Feature from "./pages/FeaturePage";
import Guidelines from "./pages/GuidelinesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC (login/register) */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        <Route 
          path="/about"
          element={
            <PublicRoute>
              <AboutPage />
            </PublicRoute>
          }
        />
        
        <Route 
          path="/feature"
          element={
            <PublicRoute>
              <Feature />
            </PublicRoute>
          }
        />

        <Route 
          path="/guidelines"
          element={
            <PublicRoute>
              <Guidelines />
            </PublicRoute>
          }
        />

         <Route
            path="/auth"
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            }
        />

        {/* PROTECTED */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
