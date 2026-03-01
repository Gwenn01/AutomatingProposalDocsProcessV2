from django.db import transaction
from rest_framework import serializers
from .models import ProposalReviewer
from django.contrib.auth.models import User
from users.serializers import UserSerializer
from proposals_node.models import Proposal
from proposals_node.serializers import ProposalSerializer
# other app
from program_proposal.models import ProgramProposal
from project_proposal.models import ProjectProposal
from activity_proposal.models import ActivityProposal

# assignment and get assigned reviewer for proposal serializer
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

    def validate(self, attrs):
        proposal = attrs.get('proposal')
        reviewer = attrs.get('reviewer')

        if ProposalReviewer.objects.filter(
            proposal=proposal,
            reviewer=reviewer
        ).exists():
            raise serializers.ValidationError(
                "This reviewer is already assigned to this proposal."
            )

        return attrs

    def to_internal_value(self, data):
        if 'reviewer' in data and 'reviewer_id' not in data:
            data = dict(data) 
            data['reviewer_id'] = data.pop('reviewer')
        return super().to_internal_value(data)

    # program has a project and activities now create a assignment for that too
    def assign_reviewer_to_child(self, proposal, reviewer, assigned_by):
    # Check if proposal is Program
        program = ProgramProposal.objects.filter(proposal=proposal).first()
        if program:
            projects = ProjectProposal.objects.filter(program_proposal=program)

            for project in projects:
                ProposalReviewer.objects.get_or_create(
                    proposal=project.proposal,
                    reviewer=reviewer,
                    defaults={'assigned_by': assigned_by}
                )

                activities = ActivityProposal.objects.filter(project_proposal=project)

                for activity in activities:
                    ProposalReviewer.objects.get_or_create(
                        proposal=activity.proposal,
                        reviewer=reviewer,
                        defaults={'assigned_by': assigned_by}
                    )
            return

    def create(self, validated_data):
        request = self.context['request']
        validated_data['assigned_by'] = request.user
        
        proposal = validated_data['proposal']
        reviewer = validated_data['reviewer']
        
         # Create reviewer for parent proposal
        with transaction.atomic():
            parent_assignment = ProposalReviewer.objects.create(**validated_data)
            self.assign_reviewer_to_child(proposal, reviewer, request.user)

        return parent_assignment

# get the my proposal of reviewer
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