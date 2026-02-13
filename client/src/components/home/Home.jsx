import Navbar from './Navbar';
import HeroSection from './home/HeroSection';
import StatsSection from './home/StatsSection';
import AboutSection from './home/AboutSection';
import FeatureSection from './home/FeatureSection';
import ProcessSection from './home/ProcessSection';
import Footer from './home/Footer';

const HomePage = () => {
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