from .models import ProposalReviewer

class ReviewerProposalSelector:
    
    @staticmethod
    def proposal_mapper(proposal_reviewer):
        proposal = proposal_reviewer.proposal

        return {
            "proposal_id": proposal.id,
            "program_id": proposal.child_id,
            "implementor_id": proposal.user,
            "title": proposal.title,
            "type": proposal.proposal_type,
            "status": proposal.status,
            "reviewer_count": proposal.reviewer_count,
            "version_no": proposal.version_no,
            "reviewed": proposal_reviewer.is_review,
            "assigned_at": proposal_reviewer.assigned_at,
        }
    def get_reviewer_assigned_proposals(user):
        proposal_reviewers = (
            ProposalReviewer.objects
            .select_related('proposal')   
            .filter(reviewer=user)
        )

        return [
            ReviewerProposalSelector.proposal_mapper(pr)
            for pr in proposal_reviewers
        ]