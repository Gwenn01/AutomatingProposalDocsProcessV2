import React from 'react';
import Navbar from './Navbar';
import AboutContent from './about/AboutContent';
import Footer from './home/Footer';
import ProblemStatement from './about/ProblemStatement';
import SystemGoals from './about/SystemGoals';
import KeyBenefits from './about/KeyBenefits';
import ConclusionCTA from './about/ConclusionCTA';


const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24">
        <AboutContent />
        <ProblemStatement />
        <SystemGoals />
        <KeyBenefits />
        <ConclusionCTA />
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;