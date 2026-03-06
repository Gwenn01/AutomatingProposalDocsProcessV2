from django.shortcuts import get_object_or_404
# app
from .models import ProposalReview, ProposalReviewHistory
from .mapper import ProposalReviewMapper
from proposals_node.models import Proposal
from program_proposal.models import ProgramProposal, ProgramProposalHistory
from project_proposal.models import ProjectProposal, ProjectProposalHistory
from activity_proposal.models import ActivityProposal, ActivityProposalHistory

class ProposalReviewSelectors:
    @staticmethod
    def proposal_reviews_mapper(proposal_id, proposal_type):
        proposal_reviews_queryset = ProposalReview.objects.select_related(
                "proposal_reviewer__reviewer__profile"
            ).filter(
                proposal_node_id=proposal_id
            )

        if proposal_type == "program":
            program = get_object_or_404(ProgramProposal, proposal=proposal_id)
            return ProposalReviewMapper.get_review_per_docs_program_mapper(program, proposal_reviews_queryset)

        elif proposal_type == "project":
            project =  get_object_or_404(ProjectProposal, proposal=proposal_id)
            return ProposalReviewMapper.get_review_per_docs_project_mapper(project, proposal_reviews_queryset)

        elif proposal_type == "activity":
            activity = get_object_or_404(ActivityProposal, proposal=proposal_id)
            return ProposalReviewMapper.get_review_per_docs_activity_mapper(activity, proposal_reviews_queryset)

        else:
            raise ValueError("Invalid proposal type")
        
    @staticmethod
    def proposal_reviews_history_mapper(proposal_id, history_id, version, proposal_type):
        proposal_reviews_queryset = ProposalReviewHistory.objects.select_related(
            "proposal_reviewer__reviewer__profile"
        ).filter(
            proposal_node_id=proposal_id,
            review_round=version
        )
        
        if proposal_type == "program":
            program = get_object_or_404(ProgramProposalHistory, id=history_id)
            return ProposalReviewMapper.get_review_per_docs_program_mapper(program, proposal_reviews_queryset)

        elif proposal_type == "project":
            project = get_object_or_404(ProjectProposalHistory, id=history_id)
            return ProposalReviewMapper.get_review_per_docs_project_mapper(project, proposal_reviews_queryset)

        elif proposal_type == "activity":
            activity = get_object_or_404(ActivityProposalHistory, id=history_id)
            return ProposalReviewMapper.get_review_per_docs_activity_mapper(activity, proposal_reviews_queryset)

        else:
            raise ValueError("Invalid proposal type")