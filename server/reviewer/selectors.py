from .models import ProposalReviewer
from .serializers import (
    ReviewerProposalSerializer,
)

class ReviewerProposalSelector:
    
    @staticmethod
    def proposal_mapper(proposal_reviewer):
        proposal = proposal_reviewer['proposal']

        return {
            "assignment": proposal_reviewer['id'],
            "proposal": proposal['id'],
            "child_id": proposal['child_id'],
            "implementor": proposal['user'],
            "implementor_name": proposal_reviewer['implementor_name'],
            "title": proposal['title'],
            "type": proposal['proposal_type'],
            "status": proposal['status'],
            "reviewer_count": proposal['reviewer_count'],
            "version_no": proposal['version_no'],
            "is_reviewed": proposal_reviewer['is_review'],
            "assigned_at": proposal_reviewer['assigned_at'],
        }
        
    def get_reviewer_assigned_program_proposals(user):
        data = []
        proposal_reviewers = ProposalReviewer.objects.filter(reviewer=user, proposal_type='program')
        serializer = ReviewerProposalSerializer(proposal_reviewers, many=True)
        for s in serializer.data:
            data.append(ReviewerProposalSelector.proposal_mapper(s))
        return data
    
    def get_reviewer_assigned_project_proposals(user, program_id):
        proposal_reviewers = ProposalReviewer.objects.filter(
            reviewer=user,
            proposal_type='project',
            proposal__project_details__program_proposal__id=program_id
        )
        serializer = ReviewerProposalSerializer(proposal_reviewers, many=True)
        return [
            ReviewerProposalSelector.proposal_mapper(s)
            for s in serializer.data
        ]
    
    def get_reviewer_assigned_activity_proposal(user, project_id):
        proposal_reviewers = ProposalReviewer.objects.filter(
            reviewer=user,
            proposal_type='activity',
            proposal__activity_details__project_proposal__id=project_id
        )
        serializer = ReviewerProposalSerializer(proposal_reviewers, many=True)
        return [
            ReviewerProposalSelector.proposal_mapper(s)
            for s in serializer.data
        ]