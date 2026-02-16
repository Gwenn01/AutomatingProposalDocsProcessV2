from rest_framework import serializers
from .models import ActivityProposal
from proposals_node.models import Proposal
from project_proposal.models import ProjectProposal

class ActivityProposalSerializer(serializers.ModelSerializer):
    
    proposal = serializers.PrimaryKeyRelatedField(read_only=True)
    project_proposal = serializers.PrimaryKeyRelatedField(read_only=True)
    
    title = serializers.CharField(write_only=True)
    project_proposal_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = ActivityProposal
        fields = "__all__"
        
    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user
        
        title = validated_data.pop("title")
        project_proposal_id = validated_data.pop("project_proposal_id")
        
        proposal = Proposal.objects.create(user=user, title=title, proposal_type="Activity")
        project_proposal = ProjectProposal.objects.get(id=project_proposal_id)
        
        activity_proposal = ActivityProposal.objects.create(
            proposal=proposal,
            project_proposal=project_proposal,
            **validated_data
        )
        return activity_proposal
        