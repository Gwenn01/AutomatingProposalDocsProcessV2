from django.shortcuts import get_object_or_404
#app
from .models import ProposalReview
from proposals_node.models import Proposal
from program_proposal.models import ProgramProposal
from project_proposal.models import ProjectProposal
from activity_proposal.models import ActivityProposal

class ProposalReviewSelectors:
    
    @staticmethod
    def get_reviews_by_proposal(proposal):
        return get_object_or_404(ProposalReview, proposal_node=proposal).reviews.all()
    
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
    