from django.db.models import Count
from .models import Proposal


class OverviewService:

    def get_status_counts(self):

        data = {}

        # ONE query for proposal types
        type_counts = (
            Proposal.objects
            .values('proposal_type')
            .annotate(total=Count('id'))
        )

        # ONE query for status
        status_counts = (
            Proposal.objects
            .values('status')
            .annotate(total=Count('id'))
        )

        # total proposals (very cheap)
        total_proposals = Proposal.objects.count()

        # convert to dictionary
        proposal = {
            'total_proposals': total_proposals,
            'total_program': 0,
            'total_project': 0,
            'total_activity': 0
        }

        for item in type_counts:
            if item['proposal_type'] == 'Program':
                proposal['total_program'] = item['total']
            elif item['proposal_type'] == 'Project':
                proposal['total_project'] = item['total']
            elif item['proposal_type'] == 'Activity':
                proposal['total_activity'] = item['total']

        status = {
            'total_under_review': 0,
            'total_for_review': 0,
            'total_for_revision': 0,
            'total_for_approval': 0,
            'total_approved': 0,
            'total_rejected': 0
        }

        for item in status_counts:
            key = f"total_{item['status']}"
            if key in status:
                status[key] = item['total']

        data['proposal'] = proposal
        data['status'] = status
        return data
