import React from 'react';
import Navbar from './Navbar';
import Footer from './home/Footer';
import GuidelinesHeader from './guidelines/GuidelinesHeader';
import ImplementorGuidelines from './guidelines/ImplementorGuidelines';
import ReviewerGuidelines from './guidelines/ReviewerGuidelines';
import AdminGuidelines from './guidelines/AdminGuidelines';
import GeneralGuidelines from './guidelines/GeneralGuidelines';


const GuidelinesPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24">
        <GuidelinesHeader />
        <ImplementorGuidelines />
        <ReviewerGuidelines />
        <AdminGuidelines />
        <GeneralGuidelines />
      </main>

      <Footer />
    </div>
  );
};

export default GuidelinesPage;