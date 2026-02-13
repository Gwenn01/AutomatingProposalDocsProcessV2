import React from 'react';
import Navbar from './Navbar';
import Footer from './home/Footer';
import FeaturesOverview from './feature/FeatureOverview';
import FeatureList from './feature/FeatureList';
import FeatureConclusion from './feature/FeatureConclusion';


const FeaturePage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24">
        <FeaturesOverview />
        <FeatureList />
        <FeatureConclusion />
      </main>

      <Footer />
    </div>
  );
};

export default FeaturePage;