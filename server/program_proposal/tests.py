from django.test import TestCase
from django.contrib.auth.models import User
from proposals_node.models import Proposal
from program_proposal.models import ProgramProposal, ProgramProposalHistory
from .serializers import  ProgramProposalSerializer, ProgramProposalHistorySerializer, ProgramProposalHistoryListSerializer
from .mapper import ProgramHistoryMapper

class ProposalTest(TestCase):
    
    def test_history_list(self):
        user = User.objects.create(username="testuser")
        proposal = Proposal.objects.create(
            user=user,
            title="Test Proposal",
            proposal_type="Program"
        )
        program_proposal = ProgramProposal.objects.create(
            proposal=proposal,
            program_title="Test Proposal"
        )
        ProgramProposalHistory.objects.create(
            proposal=proposal,
            program_title="Test History Proposal",
            version=1
        )
        ProgramProposalHistory.objects.create(
            proposal=proposal,
            program_title="Test 2 History Proposal",
            version=2
        )
        
        history = proposal.program_history.all()
        proposal_serializers = ProgramProposalSerializer(program_proposal)
        # format the current
        
        history_serializers = ProgramProposalHistoryListSerializer(history, many=True)
        # format the history
        data = ProgramHistoryMapper.history_list_mapper(proposal_serializers.data, history_serializers.data)
        print(data)
        self.assertEqual(history.count(), 2)
