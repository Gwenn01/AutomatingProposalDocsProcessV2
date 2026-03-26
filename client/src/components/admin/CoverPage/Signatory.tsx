import React from "react";

const Signatory: React.FC = () => {
    return (
        <div className="mt-12 space-y-8 text-sm font-serif text-black">
            {/* Prepared By Section */}
            <div className="grid grid-cols-2 gap-12">
                <div>
                    <p className="italic mb-8">Prepared by:</p>
                    <p>Proponent</p>
                </div>
            </div>

            {/* Noted By Section */}
            <div className="grid grid-cols-2 gap-12">
                <div>
                    <p className="italic mb-8">Noted by:</p>
                    <p>Campus Extension Coordinator</p>
                </div>
                <div>
                    <p className="italic mb-8 invisible">Noted by:</p>
                    <p>College Dean</p>
                </div>
            </div>

            {/* Endorsed By Section */}
            <div className="grid grid-cols-2 gap-12">
                <div>
                    <p className="italic mb-8">Endorsed by:</p>
                    <p>Campus Director</p>
                </div>
                {/* Flex layout pushes the name down to align with the left column */}
                <div className="flex flex-col justify-end">
                    <p className="font-bold uppercase">Katherine M. Uy, MAEd</p>
                    <p>Director, Extension Services</p>
                </div>
            </div>

            {/* Recommending Approval Section */}
            <div className="grid grid-cols-2 gap-12 pt-2">
                <div>
                    <p className="italic mb-8">Recommending Approval:</p>
                    <p className="font-bold uppercase">Marlon James A. Dedicatoria, Ph.D.</p>
                    <p>Vice-President, Research and Development</p>
                </div>
                <div>
                    <p className="italic mb-8">Certified Funds Available</p>
                    <p className="font-bold uppercase">Roberto C. Briones Jr., CPA</p>
                    <p>University Accountant IV</p>
                </div>
            </div>

            {/* Approved By Section */}
            <div className="flex flex-col items-center pt-8">
                <p className="italic mb-8 text-center">Approved by:</p>
                <div className="text-center">
                    <p className="font-bold uppercase">Roy N. Villalobos, DPA</p>
                    <p>University President</p>
                </div>
            </div>
        </div>
    );
};

export default Signatory;