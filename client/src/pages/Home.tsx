import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";

import {
  AssignToReview,
  ManageAccount,
  ManageDocuments,
  Overview,
} from "@/pages/admin";


import ReviewProposal from "./reviewer/ReviewProposal";
import { CreateProposal, ViewProposal } from "@/pages/implementor";

// Define a type for the user object
interface User {
  fullname: string;
  role: "implementor" | "instructor" | "reviewer" | "admin" | string;
  avatar?: string;
}

// Active menu type (could be expanded later if needed)
type ActiveMenu =
  | "View Proposal"
  | "Create Proposal"
  | "Edit Proposal"
  | "Profile Overview"
  | "Overview"
  | "Manage Account"
  | "Manage Documents"
  | "Assign to Review"
  | "Review Proposal"
  | null;

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [active, setActive] = useState<ActiveMenu>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  /* ================= AUTH + ROLE DEFAULT ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/", { replace: true });
      return;
    }

    const parsedUser: User = JSON.parse(storedUser);
    setUser(parsedUser);

    // ✅ ROLE-BASED DEFAULT PAGE
    switch (parsedUser.role) {
      case "instructor":
      case "implementor":
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
        {/* IMPLEMENTOR / INSTRUCTOR */}
        {active === "Create Proposal" && <CreateProposal />}
        {active === "View Proposal" && <ViewProposal />}
        {/* {active === "Profile Overview" && <ProfileOverview />} */}

        {/* ADMIN */}
        {active === "Overview" && <Overview />}
        {active === "Manage Account" && <ManageAccount />}
        {active === "Manage Documents" && <ManageDocuments />}
        {active === "Assign to Review" && <AssignToReview />}

        {/* REVIEWER */}
        {active === "Review Proposal" && <ReviewProposal />}
        {/* {active === "Profile Overview" && <ProfileOverview />} */}
      </main>
    </div>
  );
};

export default Home;
