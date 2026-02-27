import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/home/HeroSection";
import StatsSection from "@/components/landing/home/StatsSection";
import AboutSection from "@/components/landing/home/AboutSection";
import FeatureSection from "@/components/landing/home/FeatureSection";
import ProcessSection from "@/components/landing/home/ProcessSection";
import Footer from "@/components/Footer";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <FeatureSection />
      <ProcessSection />
      <Footer />
    </div>
  );
};

export default HomePage;
