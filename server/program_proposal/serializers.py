from rest_framework import serializers
from .models import ProgramProposal
from proposals_node.models import Proposal
from proposals_node.serializers import ProposalSerializer

class ProgramProposalSerializer(serializers.ModelSerializer):
     # fields that belong to Proposal
    title = serializers.CharField(write_only=True)
    proposal = serializers.PrimaryKeyRelatedField(read_only=True)
    
    proposal_node = ProposalSerializer(source='proposal', read_only=True)
    class Meta:
        model = ProgramProposal
        fields = '__all__'
    
    def create(self, validated_data):
       
        # extract proposal fields
        title = validated_data.pop("title")
        request = self.context["request"]
        user = request.user
        
        proposal = Proposal.objects.create(
            user=user,
            title=title,
            proposal_type='Program',
        )
        
        program_proposal = ProgramProposal.objects.create(
            proposal=proposal,
            **validated_data
        )
        return program_proposal  
    