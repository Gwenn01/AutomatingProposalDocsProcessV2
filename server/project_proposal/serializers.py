from rest_framework import serializers
from .models import ProjectProposal
from proposals_node.models import Proposal
from program_proposal.models import ProgramProposal

class ProjectProposalSerializer(serializers.ModelSerializer):
    
    title = serializers.CharField(write_only=True)
    program_proposal_id = serializers.IntegerField(write_only=True)
    
    proposal = serializers.PrimaryKeyRelatedField(read_only=True)
    program_proposal = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = ProjectProposal
        fields = '__all__'

    def create(self, validated_data):
        # extract proposal fields
        title = validated_data.pop("title")
        program_proposal_id = validated_data.pop("program_proposal_id")
    
        request = self.context["request"]
        user = request.user
        
        # create proposal
        proposal = Proposal.objects.create(title=title, user=user, proposal_type="Project")

        # create program proposal
        program_proposal = ProgramProposal.objects.get(id=program_proposal_id)
        
        project = ProjectProposal.objects.create(proposal=proposal, program_proposal=program_proposal, **validated_data)
        
        return project

