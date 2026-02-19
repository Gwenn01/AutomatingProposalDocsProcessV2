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
            "program": proposal['child_id'],
            "implementor": proposal['user'],
            "title": proposal['title'],
            "type": proposal['proposal_type'],
            "status": proposal['status'],
            "reviewer_count": proposal['reviewer_count'],
            "version_no": proposal['version_no'],
            "is_reviewed": proposal_reviewer['is_review'],
            "assigned_at": proposal_reviewer['assigned_at'],
        }
    def get_reviewer_assigned_proposals(user):
        data = []
        
        proposal_reviewers = ProposalReviewer.objects.filter(reviewer=user)
        serializer = ReviewerProposalSerializer(proposal_reviewers, many=True)

        for s in serializer.data:
            data.append(ReviewerProposalSelector.proposal_mapper(s))
        return data