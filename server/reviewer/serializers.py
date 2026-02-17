from rest_framework import serializers
from .models import ProposalReviewer
from django.contrib.auth.models import User
from proposals_node.models import Proposal

class ReviewerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProposalReviewer
        fields = ['id', 'proposal', 'reviewer', 'assigned_by', 'is_review', 'assigned_at']
        read_only_fields = ['assigned_by', 'assigned_at']

    def create(self, validated_data):
        request = self.context['request']
        validated_data['assigned_by'] = request.user
        return ProposalReviewer.objects.create(**validated_data)

