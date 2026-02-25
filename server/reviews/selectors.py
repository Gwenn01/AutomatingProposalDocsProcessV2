from django.shortcuts import get_object_or_404
# app
from .models import ProposalReview
from .mapper import ProposalReviewMapper
from proposals_node.models import Proposal
from program_proposal.models import ProgramProposal
from project_proposal.models import ProjectProposal
from activity_proposal.models import ActivityProposal

class ProposalReviewSelectors:
    # Return QuerySet (NOT dict)
    @staticmethod
    def get_reviews_queryset(proposal):
        return ProposalReview.objects.select_related(
            "proposal_reviewer__reviewer__profile"
        ).filter(proposal_node=proposal)

    @staticmethod
    def get_proposal(proposal_id):
        return get_object_or_404(Proposal, pk=proposal_id)

    @staticmethod
    def get_program_proposal(proposal):
        return get_object_or_404(ProgramProposal, proposal=proposal)

    @staticmethod
    def get_project_proposal(proposal):
        return get_object_or_404(ProjectProposal, proposal=proposal)

    @staticmethod
    def get_activity_proposal(proposal):
        return get_object_or_404(ActivityProposal, proposal=proposal)

    @staticmethod
    def proposal_reviews_mapper(proposal_id, proposal_type):
        proposal = ProposalReviewSelectors.get_proposal(proposal_id)
        proposal_reviews_queryset = ProposalReviewSelectors.get_reviews_queryset(proposal)

        if proposal_type == "program":
            program = ProposalReviewSelectors.get_program_proposal(proposal)
            return ProposalReviewMapper.get_review_per_docs_program_mapper(program, proposal_reviews_queryset)

        elif proposal_type == "project":
            project = ProposalReviewSelectors.get_project_proposal(proposal)
            return ProposalReviewMapper.get_review_per_docs_project_mapper(project, proposal_reviews_queryset)

        elif proposal_type == "activity":
            activity = ProposalReviewSelectors.get_activity_proposal(proposal)
            return ProposalReviewMapper.get_review_per_docs_activity_mapper(activity, proposal_reviews_queryset)

        else:
            raise ValueError("Invalid proposal type")