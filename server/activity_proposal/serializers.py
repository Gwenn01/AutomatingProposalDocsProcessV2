from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import ActivityProposal
from proposals_node.models import Proposal
from project_proposal.models import ProjectProposal
from activity_proposal.models import ActivityProposal

class ActivityProposalSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ActivityProposal
        fields = "__all__" 
        
class ActivityListDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityProposal
        fields = ['id', 'activity_title', 'project_leader']