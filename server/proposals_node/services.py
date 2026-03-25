from django.db.models import Count
from .models import Proposal
from program_proposal.models import ProgramProposal
from django.db.models import Count, Q


class OverviewService:

    def get_status_counts(self, year):

        data = {}

        # ORM QUERY SET ==========================================================
        queryset = Proposal.objects.all()
        if year:
            queryset = queryset.filter(created_at__year=year)
        # ONE query for proposal types
        type_counts = (
            queryset
            .values('proposal_type')
            .annotate(total=Count('id'))
        )
        # ONE query for status
        status_counts = (
            queryset
            .values('status')
            .annotate(total=Count('id'))
        )

        # approve and pending data
        totals = (
            queryset
            .filter(proposal_type='Program')
            .aggregate(
                total_approve=Count('id', filter=Q(status='approved')),
                total_pending=Count('id', filter=~Q(status='approved'))
            )
        )
        
        # convert to dictionary ================================================================
        proposal = {
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

        data['total'] = totals
        data['proposal'] = proposal
        data['status'] = status
        return data
