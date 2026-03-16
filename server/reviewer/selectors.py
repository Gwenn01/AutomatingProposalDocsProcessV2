from django.shortcuts import get_object_or_404
from .models import ProposalReviewer
from .serializers import (
    ReviewerProposalSerializer,
)
from program_proposal.models import ProgramProposal
from project_proposal.models import ProjectProposal
from activity_proposal.models import ActivityProposal

class ReviewerProposalSelector:
    
    @staticmethod
    def proposal_mapper(proposal_reviewer, proposal_type):
        proposal = proposal_reviewer['proposal']
        data = {
            "assignment": proposal_reviewer['id'],
            "proposal": proposal['id'],
            "child_id": proposal['child_id'],
            "implementor": proposal['user'],
            "implementor_name": proposal_reviewer['implementor_name'],
            "title": "" + proposal['title'],
            "child_title": "",
            "type": proposal['proposal_type'],
            "status": proposal['status'],
            "reviewer_count": proposal['reviewer_count'],
            "version_no": proposal['version_no'],
            "is_reviewed": proposal_reviewer['is_review'],
            "assigned_at": proposal_reviewer['assigned_at'],
        }
        
        if proposal_type == 'program':
            program = get_object_or_404(ProgramProposal, id=proposal['child_id'])
            data['child_title'] = program.program_title
        elif proposal_type == 'project':
            project = get_object_or_404(ProjectProposal, id=proposal['child_id'])
            data['child_title'] = project.project_title
        elif proposal_type == 'activity':
            activity = get_object_or_404(ActivityProposal, id=proposal['child_id'])
            data['child_title'] = activity.activity_title
        else:
            raise Exception('Invalid proposal type')
        return data
        
    def get_reviewer_assigned_program_proposals(user):
        data = []
        proposal_reviewers = ProposalReviewer.objects.filter(reviewer=user, proposal_type='program')
        serializer = ReviewerProposalSerializer(proposal_reviewers, many=True)
        for s in serializer.data:
            data.append(ReviewerProposalSelector.proposal_mapper(s, proposal_type="program"))
        return data
    
    def get_reviewer_assigned_project_proposals(user, program_id):
        proposal_reviewers = ProposalReviewer.objects.filter(
            reviewer=user,
            proposal_type='project',
            proposal__project_details__program_proposal__id=program_id
        )
        serializer = ReviewerProposalSerializer(proposal_reviewers, many=True)
        return [
            ReviewerProposalSelector.proposal_mapper(s, proposal_type="project")
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
            ReviewerProposalSelector.proposal_mapper(s, proposal_type="activity")
            for s in serializer.data
        ]