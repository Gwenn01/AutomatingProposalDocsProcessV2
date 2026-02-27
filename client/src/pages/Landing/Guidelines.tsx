import type React from "react";
import Navbar from "@/components/Navbar";
import GuidelinesHeader from "@/components/landing/guidelines/GuidelinesHeader";
import ImplementorGuidelines from "@/components/landing/guidelines/ImplementorGuidelines";
import ReviewerGuidelines from "@/components/landing/guidelines/ReviewerGuidelines";
import AdminGuidelines from "@/components/landing/guidelines/AdminGuidelines";
import GeneralGuidelines from "@/components/landing/guidelines/GeneralGuidelines";
import Footer from "@/components/Footer";

const GuidelinesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <GuidelinesHeader />
        <ImplementorGuidelines />
        <ReviewerGuidelines />
        <AdminGuidelines />
        <GeneralGuidelines />
        <Footer />
      </main>
    </div>
  );
};

export default GuidelinesPage;
