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
  user_id?: number | string;
  fullname: string;
  role: "implementor" | "instructor" | "reviewer" | "admin" | string;
  avatar?: string;
}

export type ActiveMenu =
  | "View Proposal"
  | "Create Proposal"
  | "Edit Proposal"
  | "Profile Overview"
  | "Overview"
  | "Monitoring Proposal"
  | "Manage Account"
  | "Review Documents"
  | "Assign to Review"
  | "Create Cover Page"
  | "Review Proposal"
  | "Drafts"
  | null;

// All valid menu values per role — used to validate the stored value on reload
const ROLE_MENUS: Record<string, ActiveMenu[]> = {
  implementor: ["View Proposal", "Create Proposal", "Edit Proposal", "Drafts", "Profile Overview"],
  instructor:  ["View Proposal", "Create Proposal", "Edit Proposal", "Drafts", "Profile Overview"],
  reviewer:    ["Review Proposal", "Profile Overview"],
  admin:       ["Overview", "Monitoring Proposal", "Manage Account", "Review Documents", "Assign to Review", "Create Cover Page", "Profile Overview"],
};

function getDefaultMenu(role: string): ActiveMenu {
  switch (role) {
    case "instructor":
    case "implementor": return "View Proposal";
    case "reviewer":    return "Review Proposal";
    case "admin":       return "Overview";
    default:            return null;
  }
}

// ── Per-user storage helpers ──────────────────────────────────────────────────
// Keys are scoped to user_id so different accounts never share nav state.
function menuKey(userId: string | number)  { return `activeMenu_${userId}`; }
function draftKey(userId: string | number) { return `activeDraftId_${userId}`; }

function getSavedMenu(userId: string | number, role: string): ActiveMenu {
  const saved   = localStorage.getItem(menuKey(userId)) as ActiveMenu | null;
  const allowed = ROLE_MENUS[role] ?? [];
  return saved && allowed.includes(saved) ? saved : getDefaultMenu(role);
}

function getSavedDraft(userId: string | number): string | null {
  return localStorage.getItem(draftKey(userId));
}

// ─────────────────────────────────────────────────────────────────────────────

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isProposalDirty, setIsProposalDirty] = useState(false);
  const [active, setActive]           = useState<ActiveMenu>(null);
  const [isOpen, setIsOpen]           = useState<boolean>(false);
  const [user, setUser]               = useState<User | null>(null);
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

    // Use user_id as the scope key; fall back to fullname if not present
    const uid        = parsedUser.user_id ?? parsedUser.fullname;
    const savedMenu  = getSavedMenu(uid, parsedUser.role);
    const savedDraft = getSavedDraft(uid);

    setActive(savedMenu);

    if (savedMenu === "Create Proposal" && savedDraft) {
      setActiveDraftId(savedDraft);
    }
  }, [navigate]);

  // Persist active menu whenever it changes (scoped to this user)
  useEffect(() => {
    if (!user || active === null) return;
    const uid = user.user_id ?? user.fullname;
    localStorage.setItem(menuKey(uid), active);
  }, [active, user]);

  // Persist draft id whenever it changes (scoped to this user)
  useEffect(() => {
    if (!user) return;
    const uid = user.user_id ?? user.fullname;
    if (activeDraftId !== null) {
      localStorage.setItem(draftKey(uid), activeDraftId);
    } else {
      localStorage.removeItem(draftKey(uid));
    }
  }, [activeDraftId, user]);

  /* ================= NAVIGATION ================= */
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
    if (menu !== "Create Proposal") {
      setActiveDraftId(null);
    }
    setActive(menu);
  };

  const handleEditDraft = (draftId: string) => {
    setActiveDraftId(draftId);
    setActive("Create Proposal");
  };

  const handleNewProposal = () => {
    setActiveDraftId(null);
    setActive("Create Proposal");
  };

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
            key={activeDraftId ?? "new"}
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
        {active === "Review Documents" && <ManageDocuments />}
        {active === "Assign to Review" && <AssignToReview />}
        {active === "Create Cover Page" && <CreateCoverPage />}

        {/* REVIEWER */}
        {active === "Review Proposal" && <ReviewProposal />}
      </main>
    </div>
  );
};

export default Home;