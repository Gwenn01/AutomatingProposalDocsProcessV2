from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import ActivityProposal
from proposals_node.models import Proposal
from project_proposal.models import ProjectProposal
from activity_proposal.models import ActivityProposal

class ActivityProposalSerializer(serializers.ModelSerializer):
    
    proposal = serializers.PrimaryKeyRelatedField(read_only=True)
    project_proposal = serializers.PrimaryKeyRelatedField(read_only=True)
    
    title = serializers.CharField(write_only=True)
    project_proposal_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = ActivityProposal
        fields = "__all__"
        
    def validate(self, data):
        title = data.get("title")
        project_proposal_id = data.get("project_proposal_id")
        activity_title = data.get("activity_title")
        
        if not title:
            raise serializers.ValidationError({"title": "This field is required."})

        if not project_proposal_id:
            raise ValidationError({"project_proposal_id": "This field is required"})

        try:
            project = ProjectProposal.objects.get(id=project_proposal_id)
        except ProjectProposal.DoesNotExist:
            raise ValidationError({"project_proposal_id": "Project does not exist"})

        # duplicate check
        if ActivityProposal.objects.filter(
            project_proposal=project,
            activity_title=activity_title,
        ).exists():
            raise ValidationError({
                "duplicate": "This activity already exists for this project on this date"
            })

        return data
        
        
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
        
class ActivityListDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityProposal
        fields = ['id', 'activity_title', 'project_leader']