from django.shortcuts import get_object_or_404
from proposals_node.models import Proposal
from .models import ProposalReviewer

class ProposalReviewerServices:

    @staticmethod
    def check_all_reviewer_already_review(proposal_id):
        proposal = get_object_or_404(Proposal, id=proposal_id)

        # If any reviewer is NOT reviewed → return False
        not_reviewed_exists = ProposalReviewer.objects.filter(
            proposal=proposal,
            is_review=False
        ).exists()

        return not not_reviewed_exists