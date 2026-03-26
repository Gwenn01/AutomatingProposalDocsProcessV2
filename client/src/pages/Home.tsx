import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";

import {
  AssignToReview,
  ManageAccount,
  ManageDocuments,
  MonitoringProposals,
  Overview,
  CreateCoverPage,
} from "@/pages/admin";

import ReviewProposal from "./reviewer/ReviewProposal";
import { CreateProposal, ViewProposal } from "@/pages/implementor";
import ProfileOverview from "@/pages/ProfileOverview";
import Drafts from "./implementor/Drafts";

interface User {
  fullname: string;
  role: "implementor" | "instructor" | "reviewer" | "admin" | string;
  avatar?: string;
}

type ActiveMenu =
  | "View Proposal"
  | "Create Proposal"
  | "Edit Proposal"
  | "Profile Overview"
  | "Overview"
  | "Monitoring Proposal"
  | "Manage Account"
  | "Manage Documents"
  | "Assign to Review"
  | "Create Cover Page"
  | "Review Proposal"
  | "Drafts"
  | null;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isProposalDirty, setIsProposalDirty] = useState(false);

  const [active, setActive] = useState<ActiveMenu>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Track which draft is being edited (null = new proposal)
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  /* ================= AUTH + ROLE DEFAULT ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/", { replace: true });
      return;
    }

    const parsedUser: User = JSON.parse(storedUser);
    setUser(parsedUser);

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

  // Guarded navigation — warn if leaving a dirty proposal
  const handleSetActive = (menu: ActiveMenu) => {
    if (
      active === "Create Proposal" &&
      isProposalDirty &&
      menu !== "Create Proposal"
    ) {
      const confirmed = window.confirm(
        "You have unsaved changes in your proposal. If you leave, your progress will be lost.\n\nAre you sure you want to leave?"
      );
      if (!confirmed) return;
    }
    // Clear the draft id whenever we navigate away from Create Proposal
    if (menu !== "Create Proposal") {
      setActiveDraftId(null);
    }
    setActive(menu);
  };

  // Called from <Drafts> when user clicks "Edit Draft"
  const handleEditDraft = (draftId: string) => {
    setActiveDraftId(draftId);
    setActive("Create Proposal");
  };

  // Called from <Drafts> "New Proposal" button
  const handleNewProposal = () => {
    setActiveDraftId(null);
    setActive("Create Proposal");
  };

  // Called from <CreateProposal> after final submit
  const handleSubmitSuccess = () => {
    setActiveDraftId(null);
    setActive("View Proposal");
  };

  if (!user || !active) return null;

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      <Sidebar
        role={user.role}
        active={active}
        setActive={handleSetActive}
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        user={user}
      />

      <main className="flex-1 flex flex-col overflow-y-auto relative">
        {active === "Profile Overview" && <ProfileOverview />}

        {/* IMPLEMENTOR / INSTRUCTOR */}
        {active === "Create Proposal" && (
          <CreateProposal
            key={activeDraftId ?? "new"}   // remount cleanly when switching drafts
            draftId={activeDraftId}
            onDirtyChange={setIsProposalDirty}
            onGoToDrafts={() => handleSetActive("Drafts")}
            onSubmitSuccess={handleSubmitSuccess}
          />
        )}
        {active === "View Proposal" && <ViewProposal />}
        {active === "Drafts" && (
          <Drafts
            onEditDraft={handleEditDraft}
            onNewProposal={handleNewProposal}
          />
        )}

        {/* ADMIN */}
        {active === "Overview" && <Overview />}
        {active === "Monitoring Proposal" && <MonitoringProposals />}
        {active === "Manage Account" && <ManageAccount />}
        {active === "Manage Documents" && <ManageDocuments />}
        {active === "Assign to Review" && <AssignToReview />}
        {active === "Create Cover Page" && <CreateCoverPage />}

        {/* REVIEWER */}
        {active === "Review Proposal" && <ReviewProposal />}
      </main>
    </div>
  );
};

export default Home;