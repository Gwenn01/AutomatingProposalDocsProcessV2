from rest_framework import serializers
from .models import ProposalReviewer
from django.contrib.auth.models import User
from users.serializers import UserSerializer
from proposals_node.models import Proposal
from proposals_node.serializers import ProposalSerializer

class ReviewerSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True)
    reviewer_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='reviewer',
        write_only=True
    )
    class Meta:
        model = ProposalReviewer
        fields = ['id', 'proposal', 'reviewer', 'reviewer_id', 'assigned_by', 'is_review', 'assigned_at']
        read_only_fields = ['assigned_by', 'assigned_at']

    def to_internal_value(self, data):
        if 'reviewer' in data and 'reviewer_id' not in data:
            data = dict(data) 
            data['reviewer_id'] = data.pop('reviewer')
        return super().to_internal_value(data)

    def create(self, validated_data):
        request = self.context['request']
        validated_data['assigned_by'] = request.user
        return ProposalReviewer.objects.create(**validated_data)

class ReviewerProposalSerializer(serializers.ModelSerializer):
    proposal = ProposalSerializer(read_only=True)

    class Meta:
        model = ProposalReviewer
        fields = ['id', 'proposal', 'is_review', 'assigned_at']
        read_only_fields = ['assigned_by', 'assigned_at']
        
# get the list of assigned reviewers for a proposal
class ReviewerAssignedProposalSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.username', read_only=True)
    class Meta:
        model = ProposalReviewer
        fields = ['id', 'reviewer_name', 'is_review', 'decision', 'assigned_at']