from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import ProjectProposal
from proposals_node.models import Proposal
from program_proposal.models import ProgramProposal
from activity_proposal.models import ActivityProposal
from activity_proposal.serializers import ActivityListDataSerializer

class ProjectProposalSerializer(serializers.ModelSerializer):

    activity_list = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = ProjectProposal
        fields = '__all__'

    def update(self, instance, validated_data):
        activity_list = validated_data.pop('activity_list', [])

        request = self.context["request"]
        user = request.user

        # update normal project fields first
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # instance == project_proposal
        project_proposal = instance

        # create activities
        for activity in activity_list:
            activity_proposal_root = Proposal.objects.create(
                user=user,
                title=activity.get("activity_title"),
                proposal_type="Activity"
            )

            ActivityProposal.objects.create(
                proposal=activity_proposal_root,
                project_proposal=project_proposal,  # ← HERE
                activity_title=activity.get("activity_title"),
                project_leader=activity.get("project_leader"),
                members=activity.get("project_member", []),
                activity_duration_hours=activity.get("activity_duration"),
                activity_date=activity.get("activity_date"),
            )

        return instance
          

class ProjectsListDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectProposal
        fields = ['id', 'project_title', 'project_leader', 'members', 'duration_months', 'start_date', 'end_date']
   
        
class ProjectActivitiesSerializer(serializers.ModelSerializer):
    activities = ActivityListDataSerializer(many=True, read_only=True)
    class Meta:
        model = ProjectProposal
        fields = ['id', 'project_title', 'activities']