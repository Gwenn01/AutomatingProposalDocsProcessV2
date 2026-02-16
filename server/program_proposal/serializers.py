from rest_framework import serializers
from .models import ProgramProposal
from proposals_node.models import Proposal
from proposals_node.serializers import ProposalSerializer

class ProgramProposalSerializer(serializers.ModelSerializer):
     # fields that belong to Proposal
    title = serializers.CharField(write_only=True)
    proposal = serializers.PrimaryKeyRelatedField(read_only=True)
    
    # proposal_node = ProposalSerializer(source='proposal', read_only=True)
    class Meta:
        model = ProgramProposal
        fields = '__all__'
    
    def validate(self, data):
        title = data.get("title")
        program_title = data.get("program_title")

        if not title:
            raise serializers.ValidationError({"title": "This field is required."})

        if ProgramProposal.objects.filter(
            program_title=program_title,
        ).exists():
            raise serializers.ValidationError({
                "duplicate": "This program already exists on this date"
            })

        return data
    
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
    