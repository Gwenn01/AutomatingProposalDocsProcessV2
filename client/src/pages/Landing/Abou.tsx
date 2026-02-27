import React from "react";
import Navbar from "@/components/Navbar";
import AboutContent from "@/components/landing/About/AboutContent";
import ProblemStatement from "@/components/landing/About/ProblemStatement";
import SystemGoals from "@/components/landing/About/SystemGoals";
import KeyBenefits from "@/components/landing/About/KeyBenefits";
import ConclusionCTA from "@/components/landing/About/ConclusionCTA";
import Footer from "@/components/Footer";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24"></main>
      <AboutContent />
      <ProblemStatement />
      <SystemGoals />
      <KeyBenefits />
      <ConclusionCTA />
      <Footer />
    </div>
  );
};

export default AboutPage;
