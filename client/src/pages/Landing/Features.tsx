import type React from "react";
import Navbar from "@/components/Navbar";
import FeaturesOverview from "@/components/landing/feature/FeatureOverview";
import FeatureList from "@/components/landing/feature/FeatureList";
import FeatureConclusion from "@/components/landing/feature/FeatureConclusion";
import Footer from "@/components/Footer";

const FeaturePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <FeaturesOverview />
        <FeatureList />
        <FeatureConclusion />
        <Footer />
      </main>
    </div>
  );
};

export default FeaturePage;
