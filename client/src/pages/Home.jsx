import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  AssignToReview,
  ManageAccount,
  ManageDocuments,
  Overview,
  ViewReview,
} from "./admin";
import { CreateProposal, EditProposal, ViewProposal } from "./instructor";

import ProfileOverview from "./ProfileOverview";
import ReviewProposal from "./reviewer/ReviewProposal";

const Home = () => {
  const navigate = useNavigate();

  const [active, setActive] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  /* ================= AUTH + ROLE DEFAULT ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/", { replace: true });
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // ✅ ROLE-BASED DEFAULT PAGE
    switch (parsedUser.role) {
      case "implementor":
      case "instructor":
        setActive("View Proposal");
        break;

      case "reviewer":
        setActive("Review Proposal");
        break;

      case "admin":
        setActive("Overview");
        break;

      default:
        setActive(null);
    }
  }, [navigate]);

  // Optional loading guard
  if (!user || !active) return null;

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      <Sidebar
        role={user.role}
        active={active}
        setActive={setActive}
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        user={user}
      />

      <main className="flex-1 flex flex-col overflow-y-auto relative">
        {/* SHARED / COMMON */}
        {active === "Profile Overview" && <ProfileOverview />}

        {/* IMPLEMENTOR / INSTRUCTOR */}
        {active === "Create Proposal" && <CreateProposal />}
        {active === "View Proposal" && <ViewProposal />}
        {active === "Edit Proposal" && <EditProposal />}

        {/* ADMIN */}
        {active === "Overview" && <Overview />}
        {active === "Manage Account" && <ManageAccount />}
        {active === "Manage Documents" && <ManageDocuments />}
        {active === "Assign to Review" && <AssignToReview />}

        {/* REVIEWER */}
        {active === "Review Proposal" && <ReviewProposal />}
      </main>
    </div>
  );
};

export default Home;
