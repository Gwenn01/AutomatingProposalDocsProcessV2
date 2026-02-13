// components/ReviewerModal/sections/FooterSignatures.jsx
import React from 'react';

const FooterSignatures = () => {
  return (
    <div className="py-4">
      <p className="italic my-3">Prepared by:</p>
      <p className="py-1 mb-2">Proponent</p>
      <p className="italic">Noted by:</p>

      <div className="grid grid-cols-2">
        <div>
          <p className="pt-4">Campus Extension Coordinator</p>
          <p className="pt-4 italic">Endorsed by:</p>
          <p className="pt-4"></p>
          <p className="pt-1">Campus Director</p>
          <p className="pt-4 italic">Recommending Approval:</p>
          <p className="pt-7 font-bold text-[16px]">
            MARLON JAMES A. DEDICATORIA, Ph.D.
          </p>
          <p className="pt-1">Vice-President, Research and Development</p>
        </div>

        <div>
          <p className="pt-4">College Dean</p>
          <p className="pt-4"></p>
          <p className="pt-4 font-bold text-[16px]">KATHERINE M.UY, MAEd</p>
          <p className="pt-1">Director, Extension Services</p>
          <p className="pt-4 italic">Certified Funds Available</p>
          <p className="pt-7 font-bold text-[16px]">ROBERTO C. BRIONES JR., CPA</p>
          <p className="pt-1">University Accountant IV</p>
        </div>
      </div>

      <p className="pt-10 italic text-center">Approved by:</p>
      <p className="pt-5 font-bold text-[16px] text-center">ROY N. VILLALOBOS, DPA</p>
      <p className="pt-1 text-center">University President</p>
    </div>
  );
};

export default FooterSignatures;